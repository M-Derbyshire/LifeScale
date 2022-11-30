package services_test

import (
	"log"
	"testing"
	"time"

	customtestutils "github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/custom_test_utils"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/models"
	"github.com/M-Derbyshire/LifeScale/tree/main/back_end/go_gin/services"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type ScaleServiceSuite struct {
	suite.Suite
	DB *gorm.DB
}

func (s *ScaleServiceSuite) SetupTest() {
	db, err := customtestutils.GetFreshTestDatabase()
	if err != nil {
		log.Fatal(err.Error())
	}

	s.DB = db
}

func TestScaleServiceSuite(t *testing.T) {
	suite.Run(t, new(ScaleServiceSuite))
}

// Get --------------------------------------------------------------------------------------

func (s *ScaleServiceSuite) TestGetReturnsErrorWhenScaleDoesntExist() {

	scaleId := uint64(1)
	service := services.ScaleService{DB: s.DB}

	_, err := service.Get(scaleId)

	if err == nil {
		require.Error(s.T(), err)
	}
}

func (s *ScaleServiceSuite) TestGetReturnsScaleWithDescendantsAndResolvedIDs() {

	t := s.T()

	scaleId := uint64(1)
	strScaleId := "1"
	service := services.ScaleService{DB: s.DB}

	expectedScale := models.Scale{
		ID:              scaleId,
		StrID:           strScaleId,
		Name:            "scale1",
		UsesTimespans:   true,
		DisplayDayCount: 7,
		Categories: []models.Category{
			{
				ID:            1,
				StrID:         "1",
				Name:          "category1",
				Color:         "red",
				DesiredWeight: 1,
				Actions: []models.Action{
					{
						ID:     1,
						StrID:  "1",
						Name:   "action1",
						Weight: 1,
						Timespans: []models.Timespan{
							{
								ID:          1,
								StrID:       "1",
								Date:        time.Now().UTC(),
								MinuteCount: 1,
							},
							{
								ID:          2,
								StrID:       "2",
								Date:        time.Now().UTC(),
								MinuteCount: 1,
							},
						},
					},
					{
						ID:        2,
						StrID:     "2",
						Name:      "action2",
						Weight:    1,
						Timespans: []models.Timespan{},
					},
				},
			},
			{
				ID:            2,
				StrID:         "2",
				Name:          "category2",
				Color:         "red",
				DesiredWeight: 1,
				Actions:       []models.Action{},
			},
		},
	}

	createResult := s.DB.Create(&expectedScale)
	if createResult.Error != nil {
		require.NoError(t, createResult.Error)
	}

	// Run the test --------------------
	result, err := service.Get(scaleId)

	if err != nil {
		require.NoError(t, err)
	}

	//Check equality
	require.Equal(t, scaleId, result.ID)
	require.Equal(t, expectedScale.StrID, result.StrID) // IDs should be resolved
	require.Equal(t, expectedScale.Name, result.Name)
	require.Equal(t, expectedScale.UsesTimespans, result.UsesTimespans)
	require.Equal(t, expectedScale.DisplayDayCount, result.DisplayDayCount)

	// Check the descendant entities
	require.Equal(t, len(expectedScale.Categories), len(expectedScale.Categories))
	expectedCategories := expectedScale.Categories
	for catIdx, cat := range result.Categories {
		require.Equal(t, expectedCategories[catIdx].ID, cat.ID)
		require.Equal(t, expectedCategories[catIdx].StrID, cat.StrID)
		require.Equal(t, expectedCategories[catIdx].Name, cat.Name)
		require.Equal(t, expectedCategories[catIdx].Color, cat.Color)
		require.Equal(t, expectedCategories[catIdx].DesiredWeight, cat.DesiredWeight)

		require.Equal(t, len(expectedCategories[catIdx].Actions), len(cat.Actions))
		expectedActions := expectedCategories[catIdx].Actions
		for actIdx, act := range cat.Actions {
			require.Equal(t, expectedActions[actIdx].ID, act.ID)
			require.Equal(t, expectedActions[actIdx].StrID, act.StrID)
			require.Equal(t, expectedActions[actIdx].Name, act.Name)
			require.Equal(t, expectedActions[actIdx].Weight, act.Weight)

			require.Equal(t, len(expectedActions[actIdx].Timespans), len(act.Timespans))
			expectedTimespans := expectedActions[actIdx].Timespans
			for tsIdx, ts := range act.Timespans {
				require.Equal(t, expectedTimespans[tsIdx].ID, ts.ID)
				require.Equal(t, expectedTimespans[tsIdx].StrID, ts.StrID)
				require.Equal(t, expectedTimespans[tsIdx].Date, ts.Date)
				require.Equal(t, expectedTimespans[tsIdx].MinuteCount, ts.MinuteCount)
			}
		}
	}

}

// Create -----------------------------------------------------------------------------------

// Update -----------------------------------------------------------------------------------
