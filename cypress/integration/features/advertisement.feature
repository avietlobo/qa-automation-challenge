Feature: Advertisement

Scenario: Create new advertisement
  Given I navigate to the advertisements page
  When I create new advertisement
  Then I see the advertisement displayed

Scenario: Edit any existing advertisement
  Given I navigate to the existing advertisement page
  When I edit the existing advertisement
  Then I see the edited changes reflected in the advertisement