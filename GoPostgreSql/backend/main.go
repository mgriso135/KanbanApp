package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
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

// Cliente represents a customer in the application.
type Cliente struct {
	ID             uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	RagioneSociale string `gorm:"not null" json:"ragione_sociale"`
	Indirizzo      string `gorm:"not null" json:"indirizzo"`
	PartitaIva     string `gorm:"not null;unique" json:"partita_iva"`
	CodiceSdi      string `gorm:"not null" json:"codice_sdi"`
}

// Fornitore represents a supplier in the application.
type Fornitore struct {
	ID             uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	RagioneSociale string `gorm:"not null" json:"ragione_sociale"`
	Indirizzo      string `gorm:"not null" json:"indirizzo"`
	PartitaIva     string `gorm:"not null;unique" json:"partita_iva"`
	CodiceSdi      string `gorm:"not null" json:"codice_sdi"`
}

// Prodotto represents a product in the application.
type Prodotto struct {
	CodiceProdotto string `gorm:"primaryKey;not null" json:"codice_prodotto"`
	Descrizione    string `gorm:"not null" json:"descrizione"`
}

// Kanban represents a kanban card in the application.
type Kanban struct {
	ID                uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	ClienteID         uint      `gorm:"not null" json:"cliente_id"`
	ProdottoCodice    string    `gorm:"not null" json:"prodotto_codice"`
	FornitoreID       uint      `gorm:"not null" json:"fornitore_id"`
	Quantita          uint      `gorm:"not null" json:"quantita"`
	TipoContenitore   string    `gorm:"not null" json:"tipo_contenitore"`
	Stato             string    `gorm:"not null;default:'Attivo'" json:"stato"`
	DataAggiornamento time.Time `gorm:"not null;autoCreateTime" json:"data_aggiornamento"`
	LeadTime          int       `gorm:"not null;default:0" json:"lead_time"`

	Cliente   Cliente   `gorm:"foreignKey:ClienteID" json:"cliente"`
	Prodotto  Prodotto  `gorm:"foreignKey:ProdottoCodice" json:"prodotto"`
	Fornitore Fornitore `gorm:"foreignKey:FornitoreID" json:"fornitore"`
}

// KanbanHistory represents a single state change in the kanban
type KanbanHistory struct {
	ID                uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	KanbanID          int       `gorm:"not null" json:"kanban_id"`
	Stato             string    `gorm:"not null" json:"stato"`
	DataAggiornamento time.Time `gorm:"not null;autoCreateTime" json:"data_aggiornamento"`
	Kanban            Kanban    `gorm:"foreignKey:KanbanID" json:"kanban"`
}

var db *gorm.DB
var conf Config

func init() {
	loadEnv()
	connectDb()
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

func connectDb() {
	var err error
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold: time.Second, // Slow SQL threshold
			LogLevel:      logger.Info, // Log level
			Colorful:      true,        // Disable color
		},
	)

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", conf.DbHost, conf.DbUser, conf.DbPassword, conf.DbName, conf.DbPort)
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&Cliente{}, &Fornitore{}, &Prodotto{}, &Kanban{}, &KanbanHistory{})

}

func main() {
	fmt.Println("Starting server on port " + conf.Port)
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "hello"})
	})
	router.Run(":" + conf.Port)
}
