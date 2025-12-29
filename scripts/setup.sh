#!/bin/bash

# Peloton Setup Script
# Checks prerequisites and installs dependencies

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Symbols
CHECK="✓"
CROSS="✗"
WARN="!"

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       Peloton Setup Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Track if all prerequisites are met
ALL_PREREQS_MET=true
INSTALL_NEEDED=()

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get version
get_version() {
    case $1 in
        node)
            node --version 2>/dev/null | sed 's/v//'
            ;;
        npm)
            npm --version 2>/dev/null
            ;;
        expo)
            expo --version 2>/dev/null
            ;;
        xcode)
            xcodebuild -version 2>/dev/null | head -n1 | awk '{print $2}'
            ;;
    esac
}

# Function to compare versions (returns 0 if $1 >= $2)
version_gte() {
    [ "$(printf '%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

echo -e "${BLUE}Checking prerequisites...${NC}"
echo ""

# ─────────────────────────────────────────────────────────────
# Check Node.js
# ─────────────────────────────────────────────────────────────
echo -n "Node.js (18+)... "
if command_exists node; then
    NODE_VERSION=$(get_version node)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}${CHECK} v${NODE_VERSION}${NC}"
    else
        echo -e "${RED}${CROSS} v${NODE_VERSION} (need 18+)${NC}"
        ALL_PREREQS_MET=false
        INSTALL_NEEDED+=("node")
    fi
else
    echo -e "${RED}${CROSS} Not installed${NC}"
    ALL_PREREQS_MET=false
    INSTALL_NEEDED+=("node")
fi

# ─────────────────────────────────────────────────────────────
# Check npm
# ─────────────────────────────────────────────────────────────
echo -n "npm... "
if command_exists npm; then
    NPM_VERSION=$(get_version npm)
    echo -e "${GREEN}${CHECK} v${NPM_VERSION}${NC}"
else
    echo -e "${RED}${CROSS} Not installed${NC}"
    ALL_PREREQS_MET=false
    INSTALL_NEEDED+=("npm")
fi

# ─────────────────────────────────────────────────────────────
# Check Expo CLI
# ─────────────────────────────────────────────────────────────
echo -n "Expo CLI... "
if command_exists expo; then
    EXPO_VERSION=$(get_version expo)
    echo -e "${GREEN}${CHECK} v${EXPO_VERSION}${NC}"
else
    echo -e "${YELLOW}${WARN} Not installed (will install)${NC}"
    INSTALL_NEEDED+=("expo")
fi

# ─────────────────────────────────────────────────────────────
# Check Xcode (macOS only)
# ─────────────────────────────────────────────────────────────
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -n "Xcode... "
    if command_exists xcodebuild; then
        XCODE_VERSION=$(get_version xcode)
        echo -e "${GREEN}${CHECK} v${XCODE_VERSION}${NC}"

        # Check for Xcode Command Line Tools
        echo -n "Xcode CLI Tools... "
        if xcode-select -p &>/dev/null; then
            echo -e "${GREEN}${CHECK} Installed${NC}"
        else
            echo -e "${YELLOW}${WARN} Not installed${NC}"
            INSTALL_NEEDED+=("xcode-cli")
        fi

        # Check for iOS Simulator
        echo -n "iOS Simulator... "
        if xcrun simctl list devices 2>/dev/null | grep -q "iPhone"; then
            echo -e "${GREEN}${CHECK} Available${NC}"
        else
            echo -e "${YELLOW}${WARN} No simulators found${NC}"
        fi
    else
        echo -e "${YELLOW}${WARN} Not installed (required for iOS development)${NC}"
    fi
fi

# ─────────────────────────────────────────────────────────────
# Check Git
# ─────────────────────────────────────────────────────────────
echo -n "Git... "
if command_exists git; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    echo -e "${GREEN}${CHECK} v${GIT_VERSION}${NC}"
else
    echo -e "${RED}${CROSS} Not installed${NC}"
    ALL_PREREQS_MET=false
    INSTALL_NEEDED+=("git")
fi

echo ""

# ─────────────────────────────────────────────────────────────
# Install missing prerequisites
# ─────────────────────────────────────────────────────────────
if [ ${#INSTALL_NEEDED[@]} -gt 0 ]; then
    echo -e "${BLUE}Installing missing dependencies...${NC}"
    echo ""

    # Check for Homebrew on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! command_exists brew; then
            echo -e "${YELLOW}Homebrew not found. Installing...${NC}"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
    fi

    for pkg in "${INSTALL_NEEDED[@]}"; do
        case $pkg in
            node)
                echo -e "${BLUE}Installing Node.js...${NC}"
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    brew install node@20
                    brew link node@20 --force --overwrite
                elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                fi
                ;;
            expo)
                echo -e "${BLUE}Installing Expo CLI...${NC}"
                npm install -g expo-cli @expo/ngrok
                ;;
            xcode-cli)
                echo -e "${BLUE}Installing Xcode Command Line Tools...${NC}"
                xcode-select --install 2>/dev/null || true
                echo -e "${YELLOW}Please complete the Xcode CLI installation in the popup window${NC}"
                ;;
            git)
                echo -e "${BLUE}Installing Git...${NC}"
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    brew install git
                elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                    sudo apt-get install -y git
                fi
                ;;
        esac
    done
    echo ""
fi

# ─────────────────────────────────────────────────────────────
# Check environment file
# ─────────────────────────────────────────────────────────────
echo -e "${BLUE}Checking configuration...${NC}"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo -n ".env file... "
if [ -f "$PROJECT_DIR/.env" ]; then
    echo -e "${GREEN}${CHECK} Found${NC}"

    # Check for required variables
    echo -n "  SUPABASE_URL... "
    if grep -q "SUPABASE_URL=https://" "$PROJECT_DIR/.env" 2>/dev/null && ! grep -q "SUPABASE_URL=https://your-project" "$PROJECT_DIR/.env" 2>/dev/null; then
        echo -e "${GREEN}${CHECK} Set${NC}"
    else
        echo -e "${YELLOW}${WARN} Not configured${NC}"
    fi

    echo -n "  SUPABASE_PUBLISHABLE_KEY... "
    if grep -q "SUPABASE_PUBLISHABLE_KEY=sb_" "$PROJECT_DIR/.env" 2>/dev/null || grep -q "SUPABASE_PUBLISHABLE_KEY=ey" "$PROJECT_DIR/.env" 2>/dev/null; then
        echo -e "${GREEN}${CHECK} Set${NC}"
    else
        echo -e "${YELLOW}${WARN} Not configured${NC}"
    fi

    echo -n "  MAPBOX_TOKEN... "
    if grep -q "MAPBOX_TOKEN=pk\." "$PROJECT_DIR/.env" 2>/dev/null && ! grep -q "MAPBOX_TOKEN=pk\.your" "$PROJECT_DIR/.env" 2>/dev/null; then
        echo -e "${GREEN}${CHECK} Set${NC}"
    else
        echo -e "${YELLOW}${WARN} Not configured${NC}"
    fi
else
    echo -e "${YELLOW}${WARN} Not found${NC}"
    echo ""
    echo -e "${BLUE}Creating .env from template...${NC}"
    cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
    echo -e "${GREEN}${CHECK} Created .env file${NC}"
    echo -e "${YELLOW}Please edit .env with your Supabase and Mapbox credentials${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────────
# Install npm dependencies
# ─────────────────────────────────────────────────────────────
echo -e "${BLUE}Installing project dependencies...${NC}"
echo ""

cd "$PROJECT_DIR"

if [ -f "package-lock.json" ] && [ -d "node_modules" ]; then
    echo -n "Dependencies already installed. Reinstall? [y/N] "
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -rf node_modules apps/web/node_modules apps/mobile/node_modules packages/shared/node_modules
        npm install
    else
        echo -e "${GREEN}${CHECK} Skipping npm install${NC}"
    fi
else
    npm install
fi

echo ""

# ─────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            Setup Complete              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}Next steps:${NC}"
echo ""
echo "  1. Configure your credentials in .env"
echo "     - Get Supabase credentials: https://supabase.com/dashboard"
echo "     - Get Mapbox token: https://account.mapbox.com/"
echo ""
echo "  2. Run the Supabase migration:"
echo "     - Go to SQL Editor in Supabase dashboard"
echo "     - Paste contents of: supabase/migrations/001_initial_schema.sql"
echo ""
echo "  3. Start the development servers:"
echo ""
echo "     ${BLUE}Web app:${NC}"
echo "       npm run dev:web"
echo ""
echo "     ${BLUE}Mobile app:${NC}"
echo "       cd apps/mobile && npx expo start"
echo ""

# Check if .env needs configuration
if [ -f "$PROJECT_DIR/.env" ]; then
    if ! grep -q "VITE_SUPABASE_URL=https://" "$PROJECT_DIR/.env" 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Don't forget to configure your .env file!${NC}"
        echo ""
    fi
fi
