package handlers

import (
	"errors"
	"finance/database"
	"finance/models"
	"strconv"

	"github.com/gofiber/fiber/v3"
)

type Expense struct {
	ID        uint    `gorm:"primaryKey;autoIncrement"`
	UserId    string  `gorm:"not null" json:"user_id"`
	Name      string  `gorm:"not null" json:"name"`
	Amount    float64 `gorm:"not null" json:"amount"`
	Total     float64 `gorm:"not null" json:"total"`
	Type      string  `gorm:"not null" json:"type"`
	CreatedAt string  `gorm:"autoCreateTime" json:"created_at"`
}

func NewExpense(data map[string]string, amount, total float64) *models.Expense {

	return &models.Expense{
		UserId: data["userId"],
		Name:   data["name"],
		Amount: amount,
		Total:  total,
		Type:   data["type"],
	}

}

func HandleCreateExpense(c fiber.Ctx) error {
	var user models.User
	var data map[string]string
	var total float64

	if err := c.Bind().Body(&data); err != nil {
		return err
	}

	if err := database.DB.Where("id = ?", data["userId"]).First(&user).Error; err != nil {
		return errors.New("User does not exist")
	}

	if err := database.DB.Table("expenses").Where("user_Id = ?", data["userId"]).Group("user_Id").Pluck("SUM(amount)", &total).Error; err != nil {
		return errors.New("unable to retrieve total")
	}

	amount, _ := strconv.ParseFloat(data["amount"], 64)
	total += amount
	expense := NewExpense(data, amount, total)

	database.DB.Create(&expense)
	return c.JSON(expense)

}

func getAllExpenses() ([]Expense, error) {

	var expense []Expense

	if err := database.DB.Find(&expense).Error; err != nil {
		return expense, errors.New("no expenses found")
	}

	return expense, nil
}

func HandleGetAllExpenses(c fiber.Ctx) error {

	expense, err := getAllExpenses()

	if err != nil {

		return c.Status(404).JSON("No expenses available")
	}
	return c.Status(200).JSON(&expense)

}
