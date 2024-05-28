import { StyleSheet, Text, SafeAreaView, ScrollView, View, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FooterList from "../components/footer/FooterList";
import axios from "axios";
import { LineChart, BarChart } from "react-native-chart-kit";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const Home = () => {
    const [energyData, setEnergyData] = useState([]);
    const [monthlyEnergyData, setMonthlyEnergyData] = useState([]);
    const screenWidth = Dimensions.get("window").width;
    const chartConfig = {
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#1e90ff",
        backgroundGradientTo: "#79baec",
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#98afc7"
        },
        barPercentage: 0.5
    }

    useEffect(() => {
        fetchEnergy();
    }, []);

    const fetchEnergy = async () => {
        try {
            const { data } = await axios.get('http://192.168.0.105:8000/api/get-energy');
            const energyValues = data.slice(-8).map(item => item.energy);
            console.log(energyValues);
            setEnergyData(energyValues);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchMonthlyEnergy();
    }, []);

    const fetchMonthlyEnergy = async () => {
        try {
            const {data} = await axios.get('http://192.168.0.105:8000/api/get-monthlyenergy');
            const monthlyEnergyValues = data.slice(-12).map(item => item.energyMonth);
            console.log(monthlyEnergyValues);
            setMonthlyEnergyData(monthlyEnergyValues);
        } catch (err) {
            console.error(err);
        }
    }
    
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <ScrollView>
            <View>
                <Text style={styles.mainText}>Current Energy</Text>
                {energyData.length ? <LineChart
                    data={{
                        labels: ["0:00", "3:00", "6:00", "9:00", "12:00", "15:00", "18:00", "21:00"],
                        datasets: [
                            {
                                data: energyData
                            }
                        ]
                    }}
                    width={screenWidth} // from react-native
                    height={290}
                    yAxisSuffix=" kWh"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={chartConfig}
                    fromZero={true}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                /> : <Text>Loading</Text>}
            </View>
            <View>
                <Text style={styles.mainText}>Monthly Energy</Text>
                {monthlyEnergyData.length ? <BarChart
                    data={
                        {
                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Sep", "Oct", "Nov", "Dec"],
                            datasets: [
                                {
                                    data: monthlyEnergyData
                                }
                            ]
                        }
                    }
                    width={screenWidth}
                    height={290}
                    yAxisSuffix=" kWh"
                    chartConfig={chartConfig}
                    fromZero={true}
                    style={{
                        borderRadius: 16,
                        marginVertical: 8
                    }} /> : <Text>Loading</Text>}
            </View>
            </ScrollView>
            <FooterList />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    mainText: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 5
    }
})

export default Home;