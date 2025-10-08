FROM node:22-bookworm-slim

WORKDIR /usr/src/app

# Copy package files (from scraper-service directory in build context)
COPY scraper-service/package*.json ./

# Install utilities and dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/* \
  && npm install --only=production

# Copy application code (from scraper-service/src in build context)
COPY scraper-service/src/ ./src/

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start service
CMD ["node", "src/index.js"]
