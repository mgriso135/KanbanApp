package db

import (
	"fmt"
	"log"
	"os"
	"kanban/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
        os.Getenv("DB_HOST"),
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"),
        os.Getenv("DB_PORT"),
    )

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("failed to connect to database: %v", err)
    }

    log.Println("Connected to Database")
    DB = db
    
    //Migrate the database
	err = DB.AutoMigrate(&models.Cliente{}, &models.Fornitore{},&models.Prodotto{}, &models.Kanban{}, &models.KanbanHistory{})
	if err != nil {
        log.Fatalf("failed to migrate database: %v", err)
    }
}