package main

import (
	"log"
	"os"
    "kanban/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
  	if err != nil {
    	log.Fatal("Error loading .env file")
  	}

	port := os.Getenv("PORT")
    if port == "" {
       port = "5000"
    }

	router := gin.Default()

	routes.SetupRoutes(router)

	log.Printf("Server started on port %s", port)
	router.Run(":" + port)
}