// routes/routes.go
package routes

import (
	"fmt"
	"kanban/db"
	"kanban/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetRoutes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "hello"})
	})

	// Clienti
	router.GET("/api/clienti", getClienti)
	router.POST("/api/clienti", createCliente)
	router.PUT("/api/clienti/:id", modificaCliente)

	// Fornitori
	router.GET("/api/fornitori", getFornitori)
	router.POST("/api/fornitori", createFornitore)
	router.PUT("/api/fornitori/:id", modificaFornitore)

	// Prodotti
	router.GET("/api/prodotti", getProdotti)
	router.POST("/api/prodotti", createProdotto)
	//Kanban Chain
	router.GET("/api/kanban-chain", getKanbanChains)
	router.POST("/api/kanban-chain", createKanbanChain)
	router.PUT("/api/kanban-chain/:id", modificaKanbanChain)
	//Kanban Status
	router.GET("/api/kanban-status", getKanbanStatuses)
	router.POST("/api/kanban-status", createKanbanStatus)
	router.PUT("/api/kanban-status/:id", modificaKanbanStatus)
	router.DELETE("/api/kanban-status/:id", deleteKanbanStatus)
	// Kanban Status Chain
	router.GET("/api/kanban-status-chain", getKanbanStatusChains)
	router.GET("/api/kanban-status-chain/:id", getKanbanStatusChainById)
	router.POST("/api/kanban-status-chain", createKanbanStatusChain)
	router.POST("/api/kanban-chain-status", createKanbanChainStatus)
	router.PUT("/api/kanban-chain-status/:id", updateKanbanChainStatus)
	router.PUT("/api/kanban-status-chain/:id", modificaKanbanStatusChain)
	//Kanban
	router.GET("/api/kanban", getKanbans)
	router.POST("/api/kanban", createKanban)
	router.PUT("/api/kanban/:id", modificaKanban)
	router.DELETE("/api/kanban/:id", eliminaKanban)
	//Kanban Stato
	router.PUT("/api/kanban/:id/stato", aggiornaStatoKanban)
	// Kanban History
	router.GET("/api/kanban/history", getKanbanHistory)
	// Kanban Recalculate
	router.POST("/api/kanban/recalculate", recalculateKanban)

	// Dashboard Clienti
	router.GET("/api/dashboard/clienti/:id", getKanbanCliente)

	//Dashboard Fornitori
	router.GET("/api/dashboard/fornitori/:id", getKanbanFornitore)
}

// Handler per Clienti
func getClienti(c *gin.Context) {
	var clienti []models.Cliente
	db.DB.Find(&clienti)
	c.JSON(http.StatusOK, clienti)
}
func createCliente(c *gin.Context) {
	var nuovoCliente models.Cliente
	if err := c.ShouldBindJSON(&nuovoCliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&nuovoCliente)
	c.JSON(http.StatusCreated, gin.H{"message": "Cliente creato con successo!", "id": nuovoCliente.ID})
}
func modificaCliente(c *gin.Context) {
	id := c.Param("id")
	var cliente models.Cliente
	if err := db.DB.Where("id = ?", id).First(&cliente).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente non trovato", "details": err.Error()})
		return
	}
	var updateCliente models.Cliente
	if err := c.ShouldBindJSON(&updateCliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cliente.RagioneSociale = updateCliente.RagioneSociale
	cliente.Indirizzo = updateCliente.Indirizzo
	cliente.PartitaIva = updateCliente.PartitaIva
	cliente.CodiceSdi = updateCliente.CodiceSdi

	db.DB.Save(&cliente)
	c.JSON(http.StatusOK, gin.H{"message": "Cliente modificato con successo!"})

}

// Handler per Fornitori
func getFornitori(c *gin.Context) {
	var fornitori []models.Fornitore
	db.DB.Find(&fornitori)
	c.JSON(http.StatusOK, fornitori)
}
func createFornitore(c *gin.Context) {
	var nuovoFornitore models.Fornitore
	if err := c.ShouldBindJSON(&nuovoFornitore); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&nuovoFornitore)
	c.JSON(http.StatusCreated, gin.H{"message": "Fornitore creato con successo!", "id": nuovoFornitore.ID})
}
func modificaFornitore(c *gin.Context) {
	id := c.Param("id")
	var fornitore models.Fornitore
	if err := db.DB.Where("id = ?", id).First(&fornitore).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fornitore non trovato", "details": err.Error()})
		return
	}
	var updateFornitore models.Fornitore
	if err := c.ShouldBindJSON(&updateFornitore); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fornitore.RagioneSociale = updateFornitore.RagioneSociale
	fornitore.Indirizzo = updateFornitore.Indirizzo
	fornitore.PartitaIva = updateFornitore.PartitaIva
	fornitore.CodiceSdi = updateFornitore.CodiceSdi
	db.DB.Save(&fornitore)
	c.JSON(http.StatusOK, gin.H{"message": "Fornitore modificato con successo!"})
}

// Handler per Prodotti
func getProdotti(c *gin.Context) {
	var prodotti []models.Prodotto
	db.DB.Find(&prodotti)
	c.JSON(http.StatusOK, prodotti)
}
func createProdotto(c *gin.Context) {
	var nuovoProdotto models.Prodotto
	if err := c.ShouldBindJSON(&nuovoProdotto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&nuovoProdotto)
	c.JSON(http.StatusCreated, gin.H{"message": "Prodotto creato con successo!", "codice_prodotto": nuovoProdotto.CodiceProdotto})
}

// Handler per Kanban Chain
func getKanbanChains(c *gin.Context) {
	var kanbanChains []models.KanbanChain
	db.DB.Preload("Cliente").Preload("Fornitore").Preload("Prodotto").Find(&kanbanChains)
	c.JSON(http.StatusOK, kanbanChains)
}
func createKanbanChain(c *gin.Context) {
	var nuovoKanbanChain models.KanbanChain
	var payload struct {
		Name                string `json:"name"`
		ClienteID           uint   `json:"cliente_id"`
		ProdottoCodice      string `json:"prodotto_codice"`
		FornitoreID         uint   `json:"fornitore_id"`
		LeadTime            int    `json:"lead_time"`
		Quantita            uint   `json:"quantita"`
		TipoContenitore     string `json:"tipo_contenitore"`
		KanbanStatusChainID uint   `json:"kanban_statuschain_id"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	nuovoKanbanChain.Name = payload.Name
	nuovoKanbanChain.ClienteID = payload.ClienteID
	nuovoKanbanChain.FornitoreID = payload.FornitoreID
	nuovoKanbanChain.ProdottoCodice = payload.ProdottoCodice
	nuovoKanbanChain.LeadTime = payload.LeadTime
	nuovoKanbanChain.Quantita = payload.Quantita
	nuovoKanbanChain.TipoContenitore = payload.TipoContenitore
	nuovoKanbanChain.KanbanStatusChainID = payload.KanbanStatusChainID
	db.DB.Create(&nuovoKanbanChain)
	c.JSON(http.StatusCreated, gin.H{"message": "Kanban Chain created successfully!", "id": nuovoKanbanChain.ID})
}
func modificaKanbanChain(c *gin.Context) {
	id := c.Param("id")
	var kanbanChain models.KanbanChain
	if err := db.DB.Where("id = ?", id).First(&kanbanChain).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban Chain not found", "details": err.Error()})
		return
	}
	var updateKanbanChain models.KanbanChain
	if err := c.ShouldBindJSON(&updateKanbanChain); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	kanbanChain.Name = updateKanbanChain.Name
	kanbanChain.ClienteID = updateKanbanChain.ClienteID
	kanbanChain.FornitoreID = updateKanbanChain.FornitoreID
	kanbanChain.ProdottoCodice = updateKanbanChain.ProdottoCodice
	kanbanChain.LeadTime = updateKanbanChain.LeadTime
	kanbanChain.Quantita = updateKanbanChain.Quantita
	kanbanChain.TipoContenitore = updateKanbanChain.TipoContenitore
	kanbanChain.KanbanStatusChainID = updateKanbanChain.KanbanStatusChainID

	db.DB.Save(&kanbanChain)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban Chain modified successfully!"})
}

// routes/routes.go
// Handler per Kanban Status
func getKanbanStatuses(c *gin.Context) {
	id := c.Query("kanban_chain_id")
	var kanbanStatuses []models.KanbanStatus
	var query *gorm.DB
	if id != "" {
		query = db.DB.Where("id IN (SELECT kanban_status_id FROM kanban_chain_statuses WHERE kanban_chain_id = ?)", id)
	} else {
		query = db.DB
	}

	if err := query.Find(&kanbanStatuses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch kanban statuses", "details": err.Error()})
		return
	}

	var kanbanChainStatuses []models.KanbanChainStatus

	if id != "" {
		if err := db.DB.Preload("KanbanStatus").Where("kanban_chain_id = ?", id).Find(&kanbanChainStatuses).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch kanban chain statuses", "details": err.Error()})
			return
		}

		for index, status := range kanbanStatuses {
			for _, chainStatus := range kanbanChainStatuses {
				if status.ID == chainStatus.KanbanStatusID {
					kanbanStatuses[index].Name = fmt.Sprintf("%s (%s)", status.Name, chainStatus.Name)
				}
			}
		}
	}

	c.JSON(http.StatusOK, kanbanStatuses)
}
func createKanbanStatus(c *gin.Context) {
	var nuovoKanbanStatus models.KanbanStatus
	var payload struct {
		Name  string `json:"name"`
		Color string `json:"color"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	nuovoKanbanStatus.Name = payload.Name
	nuovoKanbanStatus.Color = payload.Color
	db.DB.Create(&nuovoKanbanStatus)

	c.JSON(http.StatusCreated, gin.H{"message": "Kanban Status created successfully!", "id": nuovoKanbanStatus.ID})
}
func modificaKanbanStatus(c *gin.Context) {
	id := c.Param("id")
	var kanbanStatus models.KanbanStatus
	if err := db.DB.Where("id = ?", id).First(&kanbanStatus).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban Status not found", "details": err.Error()})
		return
	}
	var updateKanbanStatus models.KanbanStatus
	if err := c.ShouldBindJSON(&updateKanbanStatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	kanbanStatus.Name = updateKanbanStatus.Name
	kanbanStatus.Color = updateKanbanStatus.Color
	db.DB.Save(&kanbanStatus)

	c.JSON(http.StatusOK, gin.H{"message": "Kanban Status modified successfully!"})
}

// routes/routes.go
// Handler for Kanban Status Chain
func getKanbanStatusChains(c *gin.Context) {
	var kanbanStatusChains []models.KanbanStatusChain
	db.DB.Find(&kanbanStatusChains)
	c.JSON(http.StatusOK, kanbanStatusChains)
}

func getKanbanStatusChainById(c *gin.Context) {
	id := c.Param("id")
	var kanbanStatusChain models.KanbanStatusChain
	if err := db.DB.Where("id = ?", id).First(&kanbanStatusChain).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban Status Chain not found", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"name": kanbanStatusChain.Name,
		"id":   kanbanStatusChain.ID,
	})
}

func createKanbanStatusChain(c *gin.Context) {
	var nuovoKanbanStatusChain models.KanbanStatusChain
	if err := c.ShouldBindJSON(&nuovoKanbanStatusChain); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&nuovoKanbanStatusChain)
	c.JSON(http.StatusCreated, gin.H{"message": "Kanban Status Chain created successfully!", "id": nuovoKanbanStatusChain.ID})
}

func createKanbanChainStatus(c *gin.Context) {
	var payload struct {
		KanbanChainID  uint `json:"kanban_chain_id"`
		KanbanStatusID uint `json:"kanban_status_id"`
		Order          int  `json:"order"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var kanbanChainStatus models.KanbanChainStatus
	kanbanChainStatus.KanbanChainID = payload.KanbanChainID
	kanbanChainStatus.KanbanStatusID = payload.KanbanStatusID
	kanbanChainStatus.Order = payload.Order
	db.DB.Create(&kanbanChainStatus)
	c.JSON(http.StatusCreated, gin.H{"message": "Kanban Chain Status created successfully!"})
}

func updateKanbanChainStatus(c *gin.Context) {
	id := c.Param("id")
	var payload struct {
		KanbanChainID uint   `json:"kanban_chain_id"`
		Order         int    `json:"order"`
		Name          string `json:"name"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var kanbanChainStatus models.KanbanChainStatus
	if err := db.DB.Where("kanban_status_id = ? and kanban_chain_id = ?", id, payload.KanbanChainID).First(&kanbanChainStatus).Error; err == nil {
		kanbanChainStatus.Order = payload.Order
		kanbanChainStatus.Name = payload.Name
		db.DB.Save(&kanbanChainStatus)
	}
	c.JSON(http.StatusOK, gin.H{"message": "Kanban Status modified successfully!"})
}

func modificaKanbanStatusChain(c *gin.Context) {
	id := c.Param("id")
	var kanbanStatusChain models.KanbanStatusChain
	if err := db.DB.Where("id = ?", id).First(&kanbanStatusChain).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban Status Chain not found", "details": err.Error()})
		return
	}
	var updateKanbanStatusChain models.KanbanStatusChain
	if err := c.ShouldBindJSON(&updateKanbanStatusChain); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	kanbanStatusChain.Name = updateKanbanStatusChain.Name

	db.DB.Save(&kanbanStatusChain)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban Status Chain modified successfully!"})
}

func deleteKanbanStatusChain(c *gin.Context) {
	id := c.Param("id")
	var kanbanStatusChain models.KanbanStatusChain
	if err := db.DB.Where("id = ?", id).First(&kanbanStatusChain).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban Status Chain not found", "details": err.Error()})
		return
	}
	db.DB.Delete(&kanbanStatusChain)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban Status Chain eliminato con successo!"})
}

func deleteKanbanStatus(c *gin.Context) {
	id := c.Param("id")
	var kanbanStatus models.KanbanStatus
	if err := db.DB.Where("id = ?", id).First(&kanbanStatus).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban Status not found", "details": err.Error()})
		return
	}
	db.DB.Delete(&kanbanStatus)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban Status deleted successfully!"})
}

// Handler per Kanban
func getKanbans(c *gin.Context) {
	var kanbanList []models.Kanban
	db.DB.Preload("KanbanChain").Preload("KanbanChain.KanbanStatuses", func(db *gorm.DB) *gorm.DB {
		return db.Order("kanban_chain_statuses.order")
	}).Where("is_active = ?", true).Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func createKanban(c *gin.Context) {
	var payload struct {
		NumCartellini int  `json:"num_cartellini"`
		KanbanChainID uint `json:"kanban_chain_id"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var createdKanbans []models.Kanban
	for i := 0; i < payload.NumCartellini; i++ {
		nuovoKanban := models.Kanban{
			KanbanChainID: payload.KanbanChainID,
		}
		db.DB.Create(&nuovoKanban)
		createdKanbans = append(createdKanbans, nuovoKanban)
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Kanban creato con successo!", "ids": createdKanbans})
}
func modificaKanban(c *gin.Context) {
	id := c.Param("id")
	var kanban models.Kanban
	if err := db.DB.Where("id = ?", id).First(&kanban).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato", "details": err.Error()})
		return
	}
	var updateKanban models.Kanban
	if err := c.ShouldBindJSON(&updateKanban); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	kanban.KanbanChainID = updateKanban.KanbanChainID

	db.DB.Save(&kanban)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban modificato con successo!"})
}
func eliminaKanban(c *gin.Context) {
	id := c.Param("id")
	var kanban models.Kanban
	if err := db.DB.Where("id = ?", id).First(&kanban).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato", "details": err.Error()})
		return
	}
	kanban.IsActive = false
	db.DB.Save(&kanban)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban eliminato con successo!"})
}

func aggiornaStatoKanban(c *gin.Context) {
	id := c.Param("id")
	var kanban models.Kanban
	if err := db.DB.Preload("KanbanChain").Preload("KanbanChain.KanbanStatuses", func(db *gorm.DB) *gorm.DB {
		return db.Order("kanban_chain_statuses.order")
	}).Where("id = ?", id).First(&kanban).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato", "details": err.Error()})
		return
	}
	var payload struct {
		Stato string `json:"stato"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Find the current status of the kanban
	var currentStatusIndex int = 0
	for i, status := range kanban.KanbanChain.KanbanStatuses {
		if status.Name == kanban.Stato {
			currentStatusIndex = i
		}
	}
	if len(kanban.KanbanChain.KanbanStatuses) > 0 {
		nextStatusIndex := (currentStatusIndex + 1) % len(kanban.KanbanChain.KanbanStatuses)
		kanban.Stato = kanban.KanbanChain.KanbanStatuses[nextStatusIndex].Name
		kanban.DataAggiornamento = time.Now()
		db.DB.Model(&kanban).Updates(kanban)

		db.DB.Create(&models.KanbanHistory{
			KanbanID: uint(kanban.ID),
			Stato:    kanban.Stato,
		})

		c.JSON(http.StatusOK, gin.H{"message": "Stato Kanban aggiornato con successo!", "status": kanban.Stato})

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No statuses found for the current kanban"})
		return
	}
}

func getKanbanCliente(c *gin.Context) {
	id := c.Param("id")
	var kanbanList []models.Kanban
	db.DB.Preload("KanbanChain").Preload("KanbanChain.KanbanStatuses").Where("kanban_chain_id IN (SELECT id FROM kanban_chains WHERE cliente_id = ?) AND is_active = ?", id, true).Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func getKanbanFornitore(c *gin.Context) {
	id := c.Param("id")
	var kanbanList []models.Kanban
	db.DB.Preload("KanbanChain").Preload("KanbanChain.KanbanStatuses").Where("kanban_chain_id IN (SELECT id FROM kanban_chains WHERE fornitore_id = ?) AND is_active = ?", id, true).Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func getKanbanHistory(c *gin.Context) {
	var historyList []models.KanbanHistory
	db.DB.Preload("Kanban").Preload("Kanban.Prodotto").Preload("Kanban.Cliente").Preload("Kanban.Fornitore").Find(&historyList)
	c.JSON(http.StatusOK, historyList)
}

func recalculateKanban(c *gin.Context) {
	var kanbanList []models.Kanban
	if err := db.DB.Preload("KanbanChain").Where("is_active = ?", true).Find(&kanbanList).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch kanbans", "details": err.Error()})
		return
	}
	type KanbanUpdate struct {
		ID          uint
		NewQuantity uint
		NewCards    uint
	}
	var kanbanUpdates []KanbanUpdate
	for _, kanban := range kanbanList {
		history, err := kanban.GetKanbanHistoryRecords(db.DB)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch kanban history", "details": err.Error()})
			return
		}
		//Calculate Consumption
		var totalQuantity uint = 0
		var totalDays int = 0
		if len(history) > 1 {
			for i := 1; i < len(history); i++ {
				days := int(history[i-1].DataAggiornamento.Sub(history[i].DataAggiornamento).Hours() / 24)
				totalDays += days
				if history[i-1].Stato == "Svuotato" && history[i].Stato == "Attivo" {
					totalQuantity += kanban.KanbanChain.Quantita
				}
			}
		}
		var averageDailyConsumption float64 = 0

		if totalDays > 0 {
			averageDailyConsumption = float64(totalQuantity) / float64(totalDays)
		}
		fmt.Println("Total days", totalDays)
		fmt.Println("Total quantity", totalQuantity)
		fmt.Println("Average daily consumption", averageDailyConsumption)
		fmt.Println("Lead time:", kanban.KanbanChain.LeadTime)

		// Kanban Formula
		safetyStock := averageDailyConsumption * float64(kanban.KanbanChain.LeadTime)
		newQuantity := uint(safetyStock * 2) // Set a reasonable safety stock, here is multiplied by 2
		newCards := uint(safetyStock)
		if newQuantity < 1 {
			newQuantity = 1
		}
		if newCards < 1 {
			newCards = 1
		}

		kanban.KanbanChain.Quantita = newQuantity
		db.DB.Save(&kanban.KanbanChain)

		kanbanUpdates = append(kanbanUpdates, KanbanUpdate{
			ID:          kanban.ID,
			NewQuantity: newQuantity,
			NewCards:    newCards,
		})
		fmt.Println("New quantity:", newQuantity)
		fmt.Println("New cards:", newCards)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Kanban quantities recalculated!", "updates": kanbanUpdates})
}
