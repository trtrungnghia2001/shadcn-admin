# Shadcn Admin Dashboard

A full-featured admin dashboard built with React, ShadcnUI, and a Node.js backend, demonstrating modern web application patterns, real-time communication, and responsive design.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Demo](#demo)
* [Images](#images)

## Overview

Shadcn Admin Dashboard is a modular admin panel that provides robust features for managing tasks, users, and real-time chat.
It demonstrates clean architecture with frontend state management using Context and Zustand

The dashboard also showcases responsive design, dark/light theme, and integration of modern UI components via Shadcn UI.

## Features

🔐 Authentication & Authorization
* JWT-based sign in / sign up
* Role-based access control:
* Member: can CRUD their own account only, update their account
* Admin: full access including delete users

📋 Task Management

CRUD tasks using React Context + localStorage

Import/export CSV for tasks

Select, filter, search, and pagination with data table

👥 User Management

CRUD users via MongoDB + Express

Members can update their own account

Admin can create/update/delete users

Select, filter, search, and pagination with data table

Import/export CSV for user data

💬 Real-time Chat

1-1 chat powered by Socket.IO

“User is typing” indicator

Online user tracking

🌗 Dark & Light Mode

Switchable themes with Shadcn UI

Consistent styling for tables, forms, and sidebar

📊 *Dashboard & Charts

## Technologies Used

* Frontend: React, Zustand, Tailwind CSS, Shadcn Ui
* Backend: Node.js, Express, MongoDB, JWT
* Deployment: Deployed on Render

## Demo

[https://shadcn-admin-4q2f.onrender.com/](https://shadcn-admin-4q2f.onrender.com/)

## Images
