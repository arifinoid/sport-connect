{
  description = "Sport Connect - React Native (Expo) with Nix devShell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShell = pkgs.mkShell {
          name = "sport-connect-dev";
          buildInputs = with pkgs; [
            nodejs_22
            yarn
            watchman
            git
            openssl
            python3
            pkg-config
          ];
          # Helpful for node-gyp builds if any RN deps need it
          shellHook = ''
            export NODE_ENV=development
            echo "✅ Nix dev shell ready. Use: yarn, npx expo, etc."
          '';
        };
      });
}