{
  description = "Sport Connect - React Native (Expo) with Nix devShell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in {
        devShell = pkgs.mkShell {
          name = "sport-connect-dev";
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
            watchman
            git
            openssl
            python3
            pkg-config
            # Android development tools (minimal setup)
            android-tools
            jdk17
            # Note: android-studio removed to avoid unfree license issues
            # Install Android SDK manually or use Android Studio separately
          ];
          # Helpful for node-gyp builds if any RN deps need it
          shellHook = ''
            export NODE_ENV=development

            echo "✅ Nix dev shell ready. Use: pnpm, npx expo, etc."
            echo "📱 Android tools available: adb (via android-tools)"
            echo ""

            # Expo Go connectivity setup
            echo "🌐 Setting up Expo Go connectivity..."
            # Get local IP address for tunnel mode
            LOCAL_IP=$(ip route get 1.1.1.1 | awk '{print $7; exit}' 2>/dev/null || echo "localhost")
            echo "📍 Local IP detected: $LOCAL_IP"
            echo "💡 Use 'npx expo start --tunnel' if QR code doesn't work"
            echo ""

            # Android SDK setup - check if it exists first
            ANDROID_SDK_PATH=""
            if [ -d "$HOME/Android/Sdk" ]; then
              ANDROID_SDK_PATH="$HOME/Android/Sdk"
            elif [ -d "/opt/android-sdk" ]; then
              ANDROID_SDK_PATH="/opt/android-sdk"
            elif [ -d "/usr/local/android-sdk" ]; then
              ANDROID_SDK_PATH="/usr/local/android-sdk"
            fi

            if [ -n "$ANDROID_SDK_PATH" ]; then
              echo "🔧 Found Android SDK at: $ANDROID_SDK_PATH"
              export ANDROID_HOME="$ANDROID_SDK_PATH"
              export ANDROID_SDK_ROOT="$ANDROID_SDK_PATH"
              export PATH=$PATH:$ANDROID_SDK_PATH/emulator
              export PATH=$PATH:$ANDROID_SDK_PATH/platform-tools
              export PATH=$PATH:$ANDROID_SDK_PATH/tools
              export PATH=$PATH:$ANDROID_SDK_PATH/tools/bin
            else
              echo "⚠️  Android SDK not found in common locations"
              echo "💡 Install Android SDK using one of these methods:"
              echo "   1. Download from: https://developer.android.com/studio/command-line"
              echo "   2. Install Android Studio and use its SDK"
              echo "   3. Use Expo Go app instead of development build"
              echo ""
              echo "🔧 For now, unsetting ANDROID_HOME to avoid errors..."
              unset ANDROID_HOME
              unset ANDROID_SDK_ROOT
            fi

            # Check for Android devices and setup ADB
            echo "🔍 Checking for connected Android devices..."
            if command -v adb >/dev/null 2>&1; then
              # Start ADB server
              adb start-server >/dev/null 2>&1
              
              # List connected devices
              DEVICES=$(adb devices | grep -v "List of devices" | grep -v "^$" | wc -l)
              if [ "$DEVICES" -gt 0 ]; then
                echo "📱 Found $DEVICES connected Android device(s):"
                adb devices
                echo ""
                echo "🔗 Setting up ADB reverse proxy for Expo development..."
                # Setup reverse proxy for Expo (default port 8081)
                adb reverse tcp:8081 tcp:8081 2>/dev/null || echo "⚠️  Could not setup reverse proxy (device may not support it)"
                # Also setup for common Metro bundler ports
                adb reverse tcp:19000 tcp:19000 2>/dev/null || true
                adb reverse tcp:19001 tcp:19001 2>/dev/null || true
                adb reverse tcp:19002 tcp:19002 2>/dev/null || true
                echo "✅ ADB reverse proxy configured for ports 8081, 19000-19002"
              else
                echo "⚠️  No Android devices detected"
                echo "💡 Connect your Android device via USB and enable USB debugging"
                echo "💡 Or start an Android emulator"
                echo "💡 Or use Expo Go app for testing"
              fi
            else
              echo "⚠️  ADB not found - install Android SDK manually"
              echo "💡 For Android SDK: https://developer.android.com/studio/command-line"
            fi
            echo ""
          '';
        };
      });
}
