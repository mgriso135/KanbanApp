package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
    "kanban/db"
    "kanban/routes"
)


// Config struct to load config values
type Config struct {
	Port       string
	DbHost     string
	DbUser     string
	DbPassword string
	DbName     string
	DbPort     string
}



var conf Config

func init() {
	loadEnv()
}

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	conf = Config{
		Port:       os.Getenv("PORT"),
		DbHost:     os.Getenv("DB_HOST"),
		DbUser:     os.Getenv("DB_USER"),
		DbPassword: os.Getenv("DB_PASSWORD"),
		DbName:     os.Getenv("DB_NAME"),
		DbPort:     os.Getenv("DB_PORT"),
	}
	if conf.Port == "" {
		conf.Port = "5000"
	}
	if conf.DbPort == "" {
		conf.DbPort = "5432"
	}

}


func main() {
	fmt.Println("Starting server on port " + conf.Port)
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	routes.SetRoutes(router)
	db.ConnectDB()

	router.Run(":" + conf.Port)
}