#!/bin/bash
set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()     { echo -e "${BLUE}[INFO]  $1${NC}"; }
success() { echo -e "${GREEN}[OK]    $1${NC}"; }
warn()    { echo -e "${YELLOW}[WARN]  $1${NC}"; }
error()   { echo -e "${RED}[ERROR] $1${NC}"; exit 1; }

if [ "$EUID" -ne 0 ]; then
  error "Please run as root: sudo bash recreate-backend-route.sh"
fi

REAL_USER="${SUDO_USER:-$USER}"
REAL_HOME=$(eval echo "~$REAL_USER")

USER_CF_DIR="$REAL_HOME/.cloudflared"
USER_CONFIG="$USER_CF_DIR/config.yml"
ETC_CONFIG="/etc/cloudflared/config.yml"

DOMAIN="${DOMAIN:-tracker.marenax.site}"
SERVICE="${SERVICE:-http://localhost:5050}"
TUNNEL_NAME="${TUNNEL_NAME:-oldarena}"
LOCAL_TEST_URL="${LOCAL_TEST_URL:-http://localhost:5050/api/health}"
PUBLIC_TEST_URL="${PUBLIC_TEST_URL:-https://$DOMAIN/api/health}"

if [ ! -f "$USER_CONFIG" ]; then
  error "Config not found at $USER_CONFIG"
fi

log "Backing up configs ..."
cp "$USER_CONFIG" "$USER_CONFIG.bak.$(date +%Y%m%d-%H%M%S)"
if [ -f "$ETC_CONFIG" ]; then
  cp "$ETC_CONFIG" "$ETC_CONFIG.bak.$(date +%Y%m%d-%H%M%S)"
fi

if grep -q "hostname: $DOMAIN" "$USER_CONFIG"; then
  log "Updating existing $DOMAIN ingress service to $SERVICE ..."
  TMP_CONFIG="$(mktemp)"
  awk -v domain="$DOMAIN" -v service="$SERVICE" '
    $0 ~ "hostname: " domain {
      print
      getline
      print "    service: " service
      next
    }
    { print }
  ' "$USER_CONFIG" > "$TMP_CONFIG"
  mv "$TMP_CONFIG" "$USER_CONFIG"
else
  log "Injecting $DOMAIN -> $SERVICE into $USER_CONFIG ..."
  if grep -q -- "- service: http_status:404" "$USER_CONFIG"; then
    sed -i "/- service: http_status:404/i\\  - hostname: $DOMAIN\n    service: $SERVICE" "$USER_CONFIG"
  else
    printf "\n  - hostname: %s\n    service: %s\n" "$DOMAIN" "$SERVICE" >> "$USER_CONFIG"
  fi
  success "Ingress rule added."
fi

log "Syncing config to /etc/cloudflared/config.yml ..."
cp "$USER_CONFIG" "$ETC_CONFIG"
success "Config synced."

log "Adding Cloudflare DNS route for $DOMAIN ..."
sudo -u "$REAL_USER" cloudflared tunnel route dns "$TUNNEL_NAME" "$DOMAIN" 2>/dev/null \
  && success "DNS route added: $DOMAIN" \
  || warn "$DOMAIN DNS may already exist. If public URL still gives 1033, delete and recreate it from Cloudflare dashboard."

log "Restarting cloudflared service ..."
systemctl restart cloudflared
sleep 10

if systemctl is-active --quiet cloudflared; then
  success "cloudflared restarted successfully."
else
  error "cloudflared failed to restart. Check: sudo systemctl status cloudflared"
fi

echo ""
echo -e "${GREEN}Done! $DOMAIN now points to $SERVICE${NC}"
echo ""
echo "Test local backend:"
echo "  curl -i --max-time 10 $LOCAL_TEST_URL"
echo ""
echo "Test public tunnel:"
echo "  curl -i --max-time 15 $PUBLIC_TEST_URL"
echo ""
echo "Check tunnel logs:"
echo "  sudo journalctl -u cloudflared -n 40 --no-pager"
