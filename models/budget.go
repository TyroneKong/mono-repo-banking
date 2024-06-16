package models

import "time"

type Budget struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	UserID    string    `gorm:"not null" json:"userid"`
	Name      string    `gorm:"not null" json:"name"`
	Amount    float64   `gorm:" not null" josn:"amount"`
	Type      string    `gorm:"not null" json:"type"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
