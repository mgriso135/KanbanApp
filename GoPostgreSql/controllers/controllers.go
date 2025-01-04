package controllers

import (
	"kanban/db"
	"kanban/models"
    "net/http"
	"github.com/gin-gonic/gin"
    "strconv"
	"time"
)


//Clienti
func GetClienti(c *gin.Context){
    var clienti []models.Cliente
	db.DB.Find(&clienti)
    c.JSON(http.StatusOK, clienti)
}

func CreateCliente(c *gin.Context) {
    var cliente models.Cliente
    if err := c.ShouldBindJSON(&cliente); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
   db.DB.Create(&cliente)
    c.JSON(http.StatusCreated, gin.H{"message":"Cliente creato", "id": cliente.ID})
}
func UpdateCliente(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("cliente_id"))
    if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		return
	}
	var cliente models.Cliente
	if err := c.ShouldBindJSON(&cliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if db.DB.First(&cliente, id).Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente non trovato"})
		return
	}
    db.DB.Save(&cliente)
    c.JSON(http.StatusOK, gin.H{"message": "Cliente modificato"})
}

//Fornitori
func GetFornitori(c *gin.Context){
    var fornitori []models.Fornitore
	db.DB.Find(&fornitori)
    c.JSON(http.StatusOK, fornitori)
}

func CreateFornitore(c *gin.Context) {
    var fornitore models.Fornitore
    if err := c.ShouldBindJSON(&fornitore); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
   db.DB.Create(&fornitore)
    c.JSON(http.StatusCreated, gin.H{"message":"Fornitore creato", "id": fornitore.ID})
}
func UpdateFornitore(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("fornitore_id"))
    if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		return
	}
	var fornitore models.Fornitore
	if err := c.ShouldBindJSON(&fornitore); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if db.DB.First(&fornitore, id).Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fornitore non trovato"})
		return
	}
    db.DB.Save(&fornitore)
     c.JSON(http.StatusOK, gin.H{"message": "Fornitore modificato"})
}

//Prodotti
func GetProdotti(c *gin.Context){
    var prodotti []models.Prodotto
	db.DB.Find(&prodotti)
    c.JSON(http.StatusOK, prodotti)
}

func CreateProdotto(c *gin.Context) {
    var prodotto models.Prodotto
    if err := c.ShouldBindJSON(&prodotto); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
   db.DB.Create(&prodotto)
    c.JSON(http.StatusCreated, gin.H{"message":"Prodotto creato", "codice_prodotto": prodotto.CodiceProdotto})
}
//Kanban
func GetKanban(c *gin.Context){
    var kanban []models.Kanban
	db.DB.Preload("Cliente").Preload("Fornitore").Preload("Prodotto").Find(&kanban)
    c.JSON(http.StatusOK, kanban)
}

func CreateKanban(c *gin.Context) {
    var kanban models.Kanban
    if err := c.ShouldBindJSON(&kanban); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
   db.DB.Create(&kanban)
    c.JSON(http.StatusCreated, gin.H{"message":"Kanban creato", "id": kanban.ID})
}

func UpdateKanban(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("kanban_id"))
    if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		return
	}
	var kanban models.Kanban
	if err := c.ShouldBindJSON(&kanban); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if db.DB.First(&kanban, id).Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato"})
		return
	}
	db.DB.Save(&kanban)
    c.JSON(http.StatusOK, gin.H{"message": "Kanban modificato"})
}

func DeleteKanban(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("kanban_id"))
    if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		return
	}
	var kanban models.Kanban
	if db.DB.First(&kanban, id).Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato"})
		return
	}
    db.DB.Delete(&kanban)
    c.JSON(http.StatusOK, gin.H{"message": "Kanban eliminato"})
}

func UpdateKanbanState(c *gin.Context){
    id, err := strconv.Atoi(c.Param("kanban_id"))
    if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		return
	}
	var kanban models.Kanban
	if err := c.ShouldBindJSON(&gin.H{"stato": ""}); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if db.DB.First(&kanban, id).Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato"})
		return
	}
    kanban.Stato = c.MustGet("stato").(string)
	kanban.DataAggiornamento = time.Now()
	db.DB.Save(&kanban)
	db.DB.Create(&models.KanbanHistory{KanbanID:kanban.ID, Stato: kanban.Stato, DataAggiornamento: kanban.DataAggiornamento})
    c.JSON(http.StatusOK, gin.H{"message": "Kanban modificato"})
}

//Kanban History

func GetKanbanHistory(c *gin.Context){
	var kanbanHistory []models.KanbanHistory
  db.DB.Preload("Kanban").Preload("Kanban.Prodotto").Preload("Kanban.Cliente").Preload("Kanban.Fornitore").Find(&kanbanHistory)
    c.JSON(http.StatusOK, kanbanHistory)
}

//Dashboard
func GetKanbanCliente(c *gin.Context){
    id, err := strconv.Atoi(c.Param("cliente_id"))
    if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		return
	}
	var kanban []models.Kanban
	db.DB.Preload("Cliente").Preload("Prodotto").Preload("Fornitore").Where("cliente_id = ?", id).Find(&kanban)
    c.JSON(http.StatusOK, kanban)
}
func GetKanbanFornitore(c *gin.Context){
    id, err := strconv.Atoi(c.Param("fornitore_id"))
    if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Id"})
		return
	}
	var kanban []models.Kanban
	db.DB.Preload("Cliente").Preload("Prodotto").Preload("Fornitore").Where("fornitore_id = ?", id).Find(&kanban)
    c.JSON(http.StatusOK, kanban)
}