# School Management API

## Overview

The **School Management API** is a RESTful API that allows users to manage school-related data, including adding and listing schools.

## Base URL

```
https://school-management-api-yc3j.onrender.com/
```

## Endpoints

### 1. Add a School

**Endpoint:**

```
POST /addSchool
```


**Request Body (JSON):**

```json
{
  "name": "Saint Convent School",
  "address": "Jalandhar",
  "latitude": 55,
  "longitude": 72
}
```
![Screenshot 2025-03-23 161626](https://github.com/user-attachments/assets/ad5861fa-34d6-4227-95c5-9b5d1a241e49)

**Response:**

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 4,
    "name": "Saint Convent School",
    "address": "Jalandhar",
    "latitude": 55,
    "longitude": 72
  }
}
```


### 2. Get List of Schools

**Endpoint:**

```
GET /listSchools
```

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ABC Public School",
      "address": "Delhi",
      "latitude": 28.7041,
      "longitude": 77.1025
    },
    {
      "id": 2,
      "name": "XYZ International School",
      "address": "Mumbai",
      "latitude": 19.076,
      "longitude": 72.8777
    }
  ]
}
```
![Screenshot 2025-03-23 161854](https://github.com/user-attachments/assets/e53d9c1d-b1ca-4616-90ae-e8edd6e0a258)



