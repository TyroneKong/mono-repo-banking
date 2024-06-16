package handlers

import (
	"encoding/json"
	"errors"
	"finance/database"
	"finance/models"
	"log"
	"net/http"
	"strconv"

	"gorm.io/gorm"
)

type Transaction struct {
	ID         uint    `gorm:"primaryKey;autoIncrement"`
	UserID     string  `gorm:"not null" json:"user_id"`
	Name       string  `gorm:"not null" json:"name"`
	Amount     float64 `gorm:"not null" json:"amount"`
	Balance    float64 `gorm:"not null" json:"balance"`
	Currency   string  `gorm:"not null" json:"currency"`
	Type       string  `gorm:"not null" json:"type"`
	CreateDate string  `gorm:"autoCreateTime" json:"createdate"`
}

type ResponseMesage struct {
	Message string `json:"message"`
}

func NewTransaction(data map[string]string, amount, balance float64) *models.Transaction {
	return &models.Transaction{
		UserID:   data["userId"],
		Name:     data["name"],
		Amount:   amount,
		Balance:  balance,
		Currency: data["currency"],
		Type:     data["type"],
	}
}

func getBalance(data map[string]string, balance float64) error {
	if err := database.DB.Table("transactions").Select("balance").Where("user_Id = ?", data["userId"]).Scan(&balance).Error; err != nil {
		return err
	}
	return nil
}

func HandleDeleteTransaction(w http.ResponseWriter, r *http.Request) {

	var transaction models.Transaction
	// var data map[string]string

	id := r.PathValue("id")

	// if err := c.Bind().Body(&data); err != nil {
	// 	return err
	// }

	if err := database.DB.Delete(&transaction, "ID = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "id not found", http.StatusNotFound)
		}
	}

}

func HandleCreateTransaction(w http.ResponseWriter, r *http.Request) {
	var balance float64
	var user models.User
	var data map[string]string

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
	}

	if err := database.DB.First(&user, "id = ?", data["userId"]).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "User does not exist", http.StatusNotFound)
		} else {
			http.Error(w, "internal server error", http.StatusInternalServerError)
		}
		return
	}

	if err := database.DB.Table("transactions").Where("user_Id = ?", data["userId"]).Group("user_Id").Pluck("SUM(amount)", &balance).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "balance not found", http.StatusNotFound)
		}
	}

	amount, _ := strconv.ParseFloat(data["amount"], 64)

	transaction := NewTransaction(data, amount, balance)

	var response ResponseMesage
	switch transaction.Type {

	case "deposit":

		transaction.Balance = balance + transaction.Amount

		log.Printf("user id: %v, name: %v, amount: %v", transaction.UserID, transaction.Name, transaction.Amount)

	case "withdrawal":

		if transaction.Balance < transaction.Amount {
			response = ResponseMesage{
				Message: "not enough funds",
			}
		}

		transaction.Balance = balance - transaction.Amount
		transaction.Amount = -transaction.Amount

		log.Printf("user id: %v, name: %v, amount: %v", transaction.UserID, transaction.Name, transaction.Amount)

	}

	database.DB.Create(&transaction)
	w.Header().Set("content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getAllTransactions() ([]Transaction, error) {

	var transaction []Transaction

	if err := database.DB.Find(&transaction).Error; err != nil {
		return transaction, errors.New("no user found")
	}
	return transaction, nil

}

func HandleGetAllTransactions(w http.ResponseWriter, r *http.Request) {

	transaction, err := getAllTransactions()

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if err := json.NewEncoder(w).Encode(transaction); err != nil {
		log.Printf("Error encoding response %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}

}
