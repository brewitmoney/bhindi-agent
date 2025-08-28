#!/bin/bash

# Bhindi Brewit Agent PM2 Deployment Script

# Create logs directory
mkdir -p logs

case "$1" in
  "install")
    echo "Installing PM2 globally..."
    npm install -g pm2
    echo "PM2 installed!"
    ;;
  "build")
    echo "Building Bhindi Brewit Agent..."
    npm install
    npm run build
    echo "Build complete!"
    ;;
  "start")
    echo "Starting Bhindi Brewit Agent with PM2..."
    pm2 start ecosystem.config.cjs --env production 
    pm2 save
    echo "Service started!"
    ;;
  "startup")
    echo "Configuring PM2 to start on boot..."
    pm2 startup
    pm2 save
    echo "PM2 will now start automatically on boot!"
    ;;
  "stop")
    echo "Stopping Bhindi Brewit Agent..."
    pm2 stop bhindi-brewit-agent
    echo "Service stopped!"
    ;;
  "restart")
    echo "Restarting Bhindi Brewit Agent..."
    pm2 restart bhindi-brewit-agent
    echo "Service restarted!"
    ;;
  "reload")
    echo "Reloading service (zero-downtime)..."
    pm2 reload bhindi-brewit-agent
    echo "Service reloaded!"
    ;;
  "logs")
    pm2 logs bhindi-brewit-agent
    ;;
  "monitor")
    pm2 monit
    ;;
  "status")
    pm2 status
    ;;
  "update")
    echo "Updating service..."
    git pull
    npm install
    npm run build
    pm2 reload bhindi-brewit-agent
    echo "Update complete!"
    ;;
  "delete")
    echo "Deleting PM2 process..."
    pm2 delete bhindi-brewit-agent
    echo "Process deleted!"
    ;;
  *)
    echo "Usage: $0 {install|build|start|startup|stop|restart|reload|logs|monitor|status|update|delete}"
    echo ""
    echo "Commands:"
    echo "  install  - Install PM2 globally"
    echo "  build    - Build the service"
    echo "  start    - Start the service"
    echo "  startup  - Configure PM2 to start on boot"
    echo "  stop     - Stop the service"
    echo "  restart  - Restart the service"
    echo "  reload   - Zero-downtime reload"
    echo "  logs     - View logs"
    echo "  monitor  - Open PM2 monitoring dashboard"
    echo "  status   - Show service status"
    echo "  update   - Pull latest code and reload"
    echo "  delete   - Remove PM2 process"
    exit 1
    ;;
esac
