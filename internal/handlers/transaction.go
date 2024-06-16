package handlers

import (
	"errors"
	"finance/database"
	"finance/models"
	"log"
	"strconv"

	"github.com/gofiber/fiber/v3"
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

func HandleDeleteTransaction(c fiber.Ctx) error {

	var transaction models.Transaction
	// var data map[string]string

	id, err := c.ParamsInt("id")

	if err != nil {
		return errors.New("please provide a valid id")
	}

	// if err := c.Bind().Body(&data); err != nil {
	// 	return err
	// }

	if err := database.DB.Delete(&transaction, "ID = ?", id).Error; err != nil {
		return errors.New("transaction not found")
	}

	return nil

}

func HandleCreateTransaction(c fiber.Ctx) error {
	var balance float64
	var user models.User
	var data map[string]string

	if err := c.Bind().Body(&data); err != nil {
		return err
	}

	if err := database.DB.First(&user, "id = ?", data["userId"]).Error; err != nil {
		return errors.New("User does not exist")
	}

	if err := database.DB.Table("transactions").Where("user_Id = ?", data["userId"]).Group("user_Id").Pluck("SUM(amount)", &balance).Error; err != nil {
		return errors.New("unable to retrieve balance")
	}

	amount, _ := strconv.ParseFloat(data["amount"], 64)

	transaction := NewTransaction(data, amount, balance)

	switch transaction.Type {

	case "deposit":

		if err := getBalance(data, balance); err != nil {
			return errors.New("unable to retrieve balance")
		}
		transaction.Balance = balance + transaction.Amount

		log.Printf("user id: %v, name: %v, amount: %v", transaction.UserID, transaction.Name, transaction.Amount)

	case "withdrawal":

		if transaction.Balance < transaction.Amount {
			return c.JSON(fiber.Map{
				"message": "not enough funds",
			})
		}

		if err := getBalance(data, balance); err != nil {
			return errors.New("unable to retrieve balance")
		}

		transaction.Balance = balance - transaction.Amount
		transaction.Amount = -transaction.Amount

		log.Printf("user id: %v, name: %v, amount: %v", transaction.UserID, transaction.Name, transaction.Amount)

	}

	database.DB.Create(&transaction)
	return c.JSON(transaction)
}

func getAllTransactions() ([]Transaction, error) {

	var transaction []Transaction

	if err := database.DB.Find(&transaction).Error; err != nil {
		return transaction, errors.New("no user found")
	}
	return transaction, nil

}

func HandleGetAllTransactions(c fiber.Ctx) error {

	transaction, err := getAllTransactions()

	if err != nil {
		return c.Status(404).JSON("No users available")
	}

	return c.Status(200).JSON(&transaction)

}
