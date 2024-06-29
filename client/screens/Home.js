import { StyleSheet, Text, SafeAreaView, ScrollView, View, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FooterList from "../components/footer/FooterList";
import axios from "axios";
import { LineChart, BarChart } from "react-native-chart-kit";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const Home = () => {
    const [energyData, setEnergyData] = useState([]);
    const [currentEnergy, setCurrentEnergy] = useState([]);
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
            borderRadius: 0
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#98afc7"
        },
        barPercentage: 0.5
    }

    function calculateBill(kWh) {
        const rates = [
            { limit: 50, price: 1806 },
            { limit: 100, price: 1866 },
            { limit: 200, price: 2167 },
            { limit: 300, price: 2729 },
            { limit: 400, price: 3050 },
            { limit: Infinity, price: 3151 }
        ];

        let totalCost = 0;
        let remainingkWh = kWh;

        for (let i = 0; i < rates.length; i++) {
            let currentLimit = (i === 0) ? rates[i].limit : rates[i].limit - rates[i - 1].limit;

            if (remainingkWh > currentLimit) {
                totalCost += currentLimit * rates[i].price;
                remainingkWh -= currentLimit;
            } else {
                totalCost += remainingkWh * rates[i].price;
                break;
            }
        }
        return totalCost;
    }
    function formatNumber(number) {
        let numberStr = number.toString();
        let formattedStr = '';

        for (let i = numberStr.length - 1, count = 1; i >= 0; i--, count++) {
            formattedStr = numberStr[i] + formattedStr;
            if (count % 3 === 0 && i !== 0) {
                formattedStr = '.' + formattedStr;
            }
        }
        return formattedStr;
    }

    useEffect(() => {
        fetchEnergy();
    }, []);

    const fetchEnergy = async () => {
        try {
            const { data } = await axios.get('http://192.168.0.105:8000/api/get-energy');
            const energyValues1 = data.slice(-8).map(item => item.energy1);
            const energyValues2 = data.slice(-8).map(item => item.energy2);
            for (let i = 0; i < energyValues1.length; i++) energyValues1[i] += energyValues2[i];
            const current = energyValues1[energyValues1.length - 1];
            console.log(current);
            setCurrentEnergy(current);
            setEnergyData(energyValues1);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchMonthlyEnergy();
    }, []);

    const fetchMonthlyEnergy = async () => {
        try {
            const { data } = await axios.get('http://192.168.0.105:8000/api/get-monthlyenergy');
            const monthlyEnergyValues1 = data.slice(-12).map(item => item.energyMonth1);
            const monthlyEnergyValues2 = data.slice(-12).map(item => item.energyMonth2);
            for (let i = 0; i < monthlyEnergyValues1.length; i++) monthlyEnergyValues1[i] += monthlyEnergyValues2[i];
            setMonthlyEnergyData(monthlyEnergyValues1);
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
                            borderRadius: 10,
                        }}
                    /> : <Text>Loading</Text>}
                </View>
                <View style={{ margin: 5 }}>
                    <Text>- Energy cost of this month: {formatNumber(Math.round(calculateBill(currentEnergy)))} VND</Text>
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
                            borderRadius: 10,
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
        marginTop: 5,
        textTransform: 'uppercase',
    }
})

export default Home;