# Nexio-EventSphere Main Backend with MySQL, MongoDB, and Kafka

## **📂 Project Structure**  

```
/config       -> Configuration files (DB, Kafka, etc.)
/consumers    -> Kafka consumers handling message processing
/controllers  -> API controllers managing request logic
/database     -> Database connections and models (MySQL & MongoDB)
/images       -> some readme related images
/kafka        -> Kafka-related configurations and utilities
/middleware   -> Middleware for authentication, logging, validation, etc.
/producers    -> Kafka producers for publishing messages
/routes       -> API routes (Express)
/services     -> Business logic layer
/utils        -> Utility files (logging, helpers, etc.)
/webhooks     -> discord webhook's
/uploads      -> uploads folder for images and files
.env          -> For env var
server.js     -> Main entry point for the application
```

## **🚀 Features**
- **MySQL & MongoDB**: Supports relational and NoSQL databases.  
- **Kafka Integration**: Message-driven architecture with Producers & Consumers.  
- **Authentication Middleware**: Secures API requests.  
- **Structured Logging**: Console and Kafka logs for better debugging.  
- **Modular Design**: Easily maintainable and scalable microservices setup.  


## Create a `.env` file in the root directory and add before using 

```
PORT=2025
JWT_SECRET=your_jwt_secret
MYSQL_URI=mysql://user:password@host/db
MONGO_URI=mongodb://user:password@host/db
KAFKA_BROKER=kafka://localhost:9092
```


<!-- ## **📌 Setup Instructions**  

### **1️⃣ Install Dependencies**  
```bash
npm install
```

### **3️⃣ Run the Application**  
```bash
node server.js
``` -->