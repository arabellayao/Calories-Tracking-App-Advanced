import React from 'react';

import { StyleSheet, Text, View, Button, TextInput, ScrollView, Modal} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


class ExercisesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            editForm: false,
            name: "",
            duration: 0.0,
            calories: 0.0,
            selected_date: new Date(),
            selected_time: new Date(),
            date_time: new Date(),
            activities: [],
            activity_no: -1
        }

        this.fetchActivities = this.fetchActivities.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);

    }

    fetchActivities() {
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
    }

    componentDidMount() {
        this.fetchActivities();
    }

    handleAddExercise() {
        this.setState({showForm: true});
    }

    handleSaveExercise() {
        
        let date = JSON.stringify(this.state.selected_date);
        let time = JSON.stringify(this.state.selected_time);

        this.setState({
            duration: parseFloat(this.state.duration),
            calories: parseFloat(this.state.calories),
            date_time: JSON.parse(date.substring(0, 11) + time.substring(11)),
            showForm: false
          }, () => fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
              name: this.state.name,
              duration: this.state.duration,
              calories: this.state.calories,
              date: this.state.date_time
            })
          })
            .then(res => res.json())
            .then(res => {
              this.fetchActivities();
              alert("Your exercise has been added!");
            })
            .catch(err => {
              alert("Something went wrong! Verify you have filled out the fields correctly.");
            }));
    }

    backToLogin() {
        this.props.revokeAccessToken();
      }

    displayForm() {
        if (this.state.showForm) {
            
            
            return (
                <Modal>
                    <Text>{"\n\n\n\n"}</Text>
                    <View accessible={true} accessibilityLabel="You can add your exercise here." accessibilityHint="Swipe right to access each field. Remember to save your activity, or cancel.">
                        <Text style={styles.bigText}>Exercise Details</Text>
                    </View>
                    <View accessible={true} accessibilityLabel="What is the name of exercise?" accessibilityHint="Swipe right to edit">
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Name</Text>
                    </View>
                    <TextInput
                    placeholder="Run"
                    placeholderTextColor="#d9bebd"
                    onChangeText={(name) => this.setState({ name: name })}
                    value={this.state.firstName}
                    autoCapitalize="none" 
                    accessible={true} 
                    accessibilityLabel="Current name is"/>

                    <View accessible={true} accessibilityLabel="How long is your exercise in minutes?" accessibilityHint="Swipe right to edit">
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (min)</Text>
                    </View>
                    <TextInput
                    placeholder="30"
                    placeholderTextColor="#d9bebd"
                    onChangeText={(duration) => this.setState({ duration: duration })}
                    value={this.state.duration + ""}
                    autoCapitalize="none" 
                    accessible={true} 
                    accessibilityLabel="Current duration is"/>

                    <View accessible={true} accessibilityLabel=" How many calories have you burned in kcal?" accessibilityHint="Swipe right to edit">
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories burned (kcal)</Text>
                    </View>
                    <TextInput
                    placeholder="300"
                    placeholderTextColor="#d9bebd"
                    onChangeText={(calories) => this.setState({ calories: calories })}
                    value={this.state.calories + ""}
                    autoCapitalize="none" 
                    accessible={true} 
                    accessibilityLabel="Current calories burned is"/>

                    <View accessible={true} accessibilityLabel="What day is your exercise?" accessibilityHint="Swipe right to edit month, day, and year of exercise. Default is set to today.">
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Date of Exercise</Text>
                    </View>
                    <RNDateTimePicker
                        testID="dateTimePicker"
                        mode="date"
                        value={this.state.selected_date}
                        is24Hour={true}
                        display="default"
                        onChange={(event, select) => this.setState({selected_date: new Date(select)})}
                    />

                    <View accessible={true} accessibilityLabel="What time is your exercise?" accessibilityHint="Swipe right to edit hour, minute, and AM or PM of exercise. Default is set to current time.">
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Time of Exercise</Text>
                    </View>
                    <RNDateTimePicker
                        testID="dateTimePicker"
                        mode="time"
                        value={this.state.selected_time}
                        is24Hour={true}
                        display="default"
                        onChange={(event, select) => this.setState({selected_time: new Date(select)})}
                    />

                    <Button color="#942a21" title="Cancel" accessible={true} accessibilityLabel="Double click to discard this exercise" onPress={() => this.setState({showForm: false})}/>
                    <Button color="#942a21" title="Add" accessible={true} accessibilityLabel="Double click to add this exercise" onPress={() => this.handleSaveExercise()}/>
                    <Button color="#a1635f" title="Exit" accessible={true} accessibilityLabel="Double click to log out" onPress={() => this.backToLogin()} />
                </Modal>
            )
        }
        else {
            
        }
        
    }

    handleUpdateExercise() {
        let i = this.state.activity_no;
        // let date = JSON.stringify(this.state.selected_date);
        // let time = JSON.stringify(this.state.selected_time);
        
        this.setState({
            editForm: false
          }, () => fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.state.activities[i].id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': this.props.accessToken
            },
            body: JSON.stringify({
              name: this.state.activities[i].name,
              duration: this.state.activities[i].duration,
              calories: this.state.activities[i].calories,
              date: this.state.activities[i].date
            })
          })
            .then(res => res.json())
            .then(res => {
              alert("Your exercise has been updated!");
            })
            .catch(err => {
              alert("Something went wrong! Verify you have filled out the fields correctly.");
            }));
    }

    updateName(name) {
        let activities_temp = this.state.activities;
        activities_temp[this.state.activity_no].name = name;
        this.setState({activities: activities_temp});
    }

    updateDuration(duration) {
        let activities_temp = this.state.activities;
        activities_temp[this.state.activity_no].duration = duration;
        this.setState({activities: activities_temp});
    }

    updateCalories(calories) {
        let activities_temp = this.state.activities;
        activities_temp[this.state.activity_no].calories = calories;
        this.setState({activities: activities_temp});
    }

    updateDate(date) {
        let activities_temp = this.state.activities;
        let activities_temp_date = activities_temp[this.state.activity_no].date;
        
        let old_time = JSON.stringify(activities_temp_date);

        let new_date = JSON.stringify(date);


        let combine = JSON.parse(new_date.substring(0,11) + old_time.substring(11));

        activities_temp[this.state.activity_no].date = combine;

        this.setState({activities: activities_temp})
    }

    updateTime(time) {
        
        let activities_temp = this.state.activities;
        let activities_temp_date = activities_temp[this.state.activity_no].date;
        
        let old_date = JSON.stringify(activities_temp_date);

        let new_time = JSON.stringify(time);

        let combine = JSON.parse(old_date.substring(0,11) + new_time.substring(11));

        activities_temp[this.state.activity_no].date = combine;

        this.setState({activities: activities_temp})

    }


    editActivity() {
        if (this.state.editForm) {
            let i = this.state.activity_no;
    
            return (
                <Modal>
                    <Text>{"\n\n\n\n"}</Text>
                    <View>
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Name</Text>
                    </View>
                    <TextInput
                    placeholder="Run"
                    placeholderTextColor="#d9bebd"
                    onChangeText={(name) => this.updateName(name)}
                    value={this.state.activities[i].name}
                    autoCapitalize="none" />
    
                    <View>
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (min)</Text>
                    </View>
                    <TextInput
                    placeholder="30"
                    placeholderTextColor="#d9bebd"
                    onChangeText={(duration) => this.updateDuration(duration)}
                    value={this.state.activities[i].duration + ""}
                    autoCapitalize="none" />
    
                    <View>
                        <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories burned (kcal)</Text>
                    </View>
                    <TextInput
                    placeholder="300"
                    placeholderTextColor="#d9bebd"
                    onChangeText={(calories) => this.updateCalories(calories)}
                    value={this.state.activities[i].calories + ""}
                    autoCapitalize="none" />
    
                    <RNDateTimePicker
                        testID="dateTimePicker"
                        mode="date"
                        value={new Date(this.state.activities[i].date)}
                        is24Hour={true}
                        display="default"
                        onChange={(event, select) => this.updateDate(select)}
                    />
    
                    <RNDateTimePicker
                        testID="dateTimePicker"
                        mode="time"
                        value={new Date(this.state.activities[i].date)}
                        is24Hour={true}
                        display="default"
                        onChange={(event, select) => this.updateTime(select)}
                    />
    
                    <Button color="#942a21" title="Cancel" onPress={() => this.setState({editForm: false})}/>
                    <Button color="#942a21" title="Add" onPress={() => this.handleUpdateExercise(i)}/>
                    <Button color="#a1635f" title="Exit" onPress={() => this.backToLogin()} />
                </Modal>
            )
        }
        
    }

    handleEditForm(i) {
        this.setState({editForm: true, activity_no: i})
    }

    deleteActivity(i) {
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.state.activities[i].id, {
            method: 'DELETE',
            headers: {
              'x-access-token': this.props.accessToken
            }
          })
            .then(res => res.json())
            .then(res => {
              this.fetchActivities();
              alert("Your exercise has been deleted!");
              
            })
            .catch(err => {
              alert("Something went wrong!");
            })
           ;

        

    }


    getActivities() {
        let activities = [];
        let one_activity;
        for (let i = 0; i < this.state.activities.length; i++) {
            one_activity = (
                <Card key={i}>
                    <Card.Content>
                        <Title>{this.state.activities[i].name}</Title>
                        <Text>Duration: {this.state.activities[i].duration} min</Text>
                        <Text>Calories: {this.state.activities[i].calories} kcal</Text>
                        <Text>Date: {new Date(this.state.activities[i].date).toString()}</Text>
                        <Button color="#942a21" title="Edit" onPress={() => this.handleEditForm(i)}/>
                        <Button color="#942a21" title="Delete" onPress={() => this.deleteActivity(i)}/>
                    </Card.Content>
                </Card>
            )
            activities.push(one_activity);
        }
        return (
            <>
            <ScrollView>{activities}</ScrollView>
            </>
        );
        
    }

    render() {
        return (
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
                <View style={styles.space} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} accessible={true} accessibilityHint="You can add exercises and access all added exercises here. Swipe left to go to the previous element. Swipe right to go to the next element">
                <Icon name="soccer-ball-o" size={40} color="#900" style={{ marginRight: 20 }} />
                <Text style={styles.bigText}>Exercises</Text>
                </View>
                <View style={styles.spaceSmall}></View>
                <View>
                    <Button color="#942a21" style={styles.buttonInline} accessible={true} accessibilityLabel="Double click to add a new exercise. Or swipe right to navigate through all your added exercises" title="Add Exercise" onPress={() => this.handleAddExercise()}/>
                    {this.displayForm()}
                    {this.getActivities()}
                    {this.editActivity()}
                </View>
            </ScrollView>)
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

export default ExercisesView;