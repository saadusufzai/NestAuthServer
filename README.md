# User Authentication API

This project provides user authentication APIs built using NestJS, TypeORM, JWT, and Passport. The API supports user registration, login, and status retrieval.

## Features

- User registration
- User login
- Access and refresh tokens
- User status retrieval

## API Endpoints

### Authentication

#### Register

- **Endpoint:** `/auth/register`
- **Endpoint:** `/auth/login`
- **Endpoint:** `/user/status`


#### ENV Variables
NODE_ENV='DEV'
port=8083
DATABASE='development'
HOST='127.0.0.1'

AT_TOKEN=useyourtoken
RT_TOKEN=useyourtoken
JWT_SECRET=useyourtoken