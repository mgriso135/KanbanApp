// db/db.go
package db

import (
	"fmt"
	"kanban/models"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB
var conf Config

type Config struct {
	DbHost     string
	DbUser     string
	DbPassword string
	DbName     string
	DbPort     string
}

func ConnectDB() {
	loadEnv()

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold: time.Second, // Slow SQL threshold
			LogLevel:      logger.Info, // Log level
			Colorful:      true,        // Disable color
		},
	)

	dbPort, err := strconv.Atoi(conf.DbPort)
	if err != nil {
		panic(err)
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable", conf.DbHost, conf.DbUser, conf.DbPassword, conf.DbName, dbPort)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		panic("failed to connect database")
	}

	log.Println("Connected to Database")
	DB = db

	//Migrate the database
	err = DB.AutoMigrate(&models.Cliente{}, &models.Fornitore{}, &models.Prodotto{}, &models.Kanban{}, &models.KanbanHistory{}, &models.KanbanChain{}, &models.KanbanStatus{}, &models.KanbanChainStatus{}, &models.KanbanStatusChain{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

}
func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	conf = Config{
		DbHost:     os.Getenv("DB_HOST"),
		DbUser:     os.Getenv("DB_USER"),
		DbPassword: os.Getenv("DB_PASSWORD"),
		DbName:     os.Getenv("DB_NAME"),
		DbPort:     os.Getenv("DB_PORT"),
	}
	if conf.DbPort == "" {
		conf.DbPort = "5432"
	}
}
