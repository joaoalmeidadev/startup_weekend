# syntax=docker/dockerfile:1
# check=error=true

# Production image, built and deployed by Kamal (bin/kamal deploy).
# Manual build: docker build -t app . && docker run -d -p 80:3000 -e RAILS_MASTER_KEY=<config/master.key> app

ARG RUBY_VERSION=3.1.7
ARG NODE_VERSION=24.10.0

FROM docker.io/library/node:${NODE_VERSION}-bookworm-slim AS node

FROM docker.io/library/ruby:${RUBY_VERSION}-slim-bookworm AS base

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development:test"

# Match the Bundler version from Gemfile.lock (the image default can't read `ruby file:`)
ARG BUNDLER_VERSION=2.6.8
RUN gem install bundler -v "${BUNDLER_VERSION}" --no-document

# Build stage: gems + Vite assets. Nothing from here but the results reaches the final image.
FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev libyaml-dev pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Node.js + Yarn, only needed to build assets
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/corepack/dist/corepack.js /usr/local/bin/corepack && \
    corepack enable yarn --install-directory /usr/local/bin

COPY Gemfile Gemfile.lock .ruby-version ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN bundle exec bootsnap precompile app/ lib/

# Build Vite assets without requiring the real master key
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

RUN rm -rf node_modules

# Final stage
FROM base

COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp
USER 1000:1000

ENTRYPOINT ["/rails/bin/docker-entrypoint"]

EXPOSE 3000
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
