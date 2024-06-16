package models

import "time"

type Expense struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	UserId    string    `gorm:"not null" json:"user_id"`
	Name      string    `gorm:"not null" json:"name"`
	Amount    float64   `gorm:"not null" json:"amount"`
	Total     float64   `gorm:"not null" json:"total"`
	Type      string    `gorm:"not null" json:"type"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
