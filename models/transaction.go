package models

import "time"

type Transaction struct {
	ID         uint      `gorm:"primaryKey;autoIncrement"`
	UserID     string    `gorm:"not null" json:"user_id"`
	Name       string    `gorm:"not null" json:"name"`
	Amount     float64   `gorm:"not null" json:"amount"`
	Balance    float64   `gorm:"not null" json:"balance"`
	Currency   string    `gorm:"not null" json:"currency"`
	Type       string    `gorm:"not null" json:"type"`
	CreateDate time.Time `gorm:"autoCreateTime" json:"createdate"`
}
