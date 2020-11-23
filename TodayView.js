import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, ScrollView} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';



class TodayView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            goalDailyCalories: 0.0,
            goalDailyActivity: 0.0,
            today: new Date()
        }

    }

    componentDidMount() {

        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
          })
            .then(res => res.json())
            .then(res => {
              this.setState({
                activities: res.activities
              });
            })
            .catch(err => {
                alert("Something went wrong!");
            });

        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
          })
            .then(res => res.json())
            .then(res => {
              this.setState({
                goalDailyActivity: res.goalDailyActivity
              });
            })
            .catch(err => {
                alert("Something went wrong! Verify you have filled out the fields correctly.");
            });

            

        this._navListener = this.props.navigation.addListener('focus', () => {
            

            fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, {
            method: 'GET',
            headers: { 'x-access-token': this.props.accessToken }
            })
            .then(res => res.json())
            .then(res => {
              this.setState({
                goalDailyActivity: res.goalDailyActivity
              });
            })
            .catch(err => {
                alert("Something went wrong! Verify you have filled out the fields correctly.");
            });

            fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                method: 'GET',
                headers: { 'x-access-token': this.props.accessToken }
            })
            .then(res => res.json())
            .then(res => {
              this.setState({
                activities: res.activities
              });
            })
            .catch(err => {
                alert("Something went wrong! Verify you have filled out the fields correctly.");
            });
        });
    }

    

    getActivities() {
        let activities = [];
        let one_activity;
        let time = 0;
        for (let i = 0; i < this.state.activities.length; i++) {
            
            if(this.state.today.toDateString() === new Date(this.state.activities[i].date).toDateString()) {
                
                one_activity = (
                    <Card key={i}>
                        <Card.Content>
                            <Title>{this.state.activities[i].name}</Title>
                            <Text>Duration: {this.state.activities[i].duration} min</Text>
                            <Text>Calories: {this.state.activities[i].calories} kcal</Text>
                        </Card.Content>
                    </Card>
                )
                activities.push(one_activity);
                time += this.state.activities[i].duration
            }

            
        }
        return (
            <>
            {activities}
            <Card>
                <Card.Content>
                    <Title>Today Summary:</Title>
                    <Text>You have completed {time} mins of exercises today.</Text>
                    <Text>You goal is {this.state.goalDailyActivity} mins.</Text>
                </Card.Content>
            </Card>
            
            </>
        );
        
    }

    

    render() {
        return (
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Icon accessible={false} name="calendar" size={40} color="#900" style={{ marginRight: 20 }} />
                <Text style={styles.bigText} accessible={true} accessibilityHint="You can access today’s activities here. Swipe left to access the previous element, swipe right to access the next element. Please continue to swipe right if you want to change the tab.">Today</Text>
                {this.getActivities()}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
      height: Dimensions.get('window').height
    },
    mainContainer: {
      flex: 1
    },
    scrollViewContainer: {},
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    bigText: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 5
    },
    spaceSmall: {
      width: 20,
      height: 10,
    },
    space: {
      width: 20,
      height: 20,
    },
    spaceHorizontal: {
      display: "flex",
      width: 20
    },
    buttonInline: {
      display: "flex"
    },
    input: {
      width: 200,
      padding: 10,
      margin: 5,
      height: 40,
      borderColor: '#c9392c',
      borderWidth: 1
    },
    inputInline: {
      flexDirection: "row",
      display: "flex",
      width: 200,
      padding: 10,
      margin: 5,
      height: 40,
      borderColor: '#c9392c',
      borderWidth: 1
    }
  });

export default TodayView;