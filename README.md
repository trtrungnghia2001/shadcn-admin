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
* CRUD tasks using React Context + localStorage
* Import/export CSV for tasks
* Select, filter, search, and pagination with data table

👥 User Management
* CRUD users via MongoDB + Express
* Members can update their own account
* Admin can create/update/delete users
* Select, filter, search, and pagination with data table
* Import/export CSV for user data
* Drag and drop with dndkit

💬 Real-time Chat and Video call
* 1-1 chat powered by Socket.IO
* “User is typing” indicator
* Online user tracking
* WebRTC

🌗 Dark & Light Mode
* Switchable themes with Shadcn UI
* Consistent styling for tables, forms, and sidebar

📊 Dashboard & Charts

## Technologies Used

* Frontend: React, Zustand, Tailwind CSS, Shadcn Ui
* Backend: Node.js, Express, MongoDB, JWT
* Deployment: Deployed on Render

## Demo

[https://shadcn-admin-4q2f.onrender.com/](https://shadcn-admin-4q2f.onrender.com/)

## Images

<img width="1920" height="1091" alt="1" src="https://github.com/user-attachments/assets/6762b78b-bee8-4442-8c15-97f9daa4f76f" />
<img width="1920" height="1011" alt="2" src="https://github.com/user-attachments/assets/fb449602-42e9-478a-9913-a95eb6b8a429" />
<img width="1920" height="1436" alt="screencapture-shadcn-admin-4q2f-onrender-2025-12-15-11_41_04" src="https://github.com/user-attachments/assets/af0f578e-3e61-4674-a4d1-44ecbcffe300" />
<img width="1920" height="1436" alt="screencapture-shadcn-admin-4q2f-onrender-2025-12-15-11_41_04" src="https://github.com/user-attachments/assets/6469e49b-204c-425e-a0b7-e4f58d283cff" />
<img width="1920" height="863" alt="3" src="https://github.com/user-attachments/assets/fbba1e33-eb5f-432f-9c40-7f54509ea8ee" />
<img width="1920" height="1183" alt="4" src="https://github.com/user-attachments/assets/b65c7093-0f87-449a-91ee-84fe5c99ec39" />
<img width="2230" height="868" alt="5" src="https://github.com/user-attachments/assets/c5ba8ba8-7bf9-4e93-83b4-b4f811e695c4" />
