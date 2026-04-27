-- CSE 412 Phase 2 schema (Group 37)
-- 5 tables for Mobile Phones Market Comparison Platform.
-- Drop in reverse-FK order, create in forward-FK order.

DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS listing;
DROP TABLE IF EXISTS app_user;
DROP TABLE IF EXISTS model;
DROP TABLE IF EXISTS seller;

CREATE TABLE seller (
  seller_id    SERIAL PRIMARY KEY,
  name         VARCHAR(255) UNIQUE NOT NULL,
  website_link VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE app_user (
  user_id  SERIAL PRIMARY KEY,
  name     VARCHAR(255) NOT NULL,
  email    VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE model (
  model_id SERIAL PRIMARY KEY,
  brand    VARCHAR(255) NOT NULL,
  name     VARCHAR(255) NOT NULL,
  storage  VARCHAR(50)  NOT NULL
);

CREATE TABLE listing (
  listing_id SERIAL PRIMARY KEY,
  model_id   INT REFERENCES model(model_id)   NOT NULL,
  seller_id  INT REFERENCES seller(seller_id) NOT NULL,
  price      NUMERIC(10,2) NOT NULL CHECK (price > 0)
);

CREATE TABLE favorite (
  user_id    INT REFERENCES app_user(user_id) NOT NULL,
  listing_id INT REFERENCES listing(listing_id) NOT NULL,
  PRIMARY KEY (user_id, listing_id)
);
