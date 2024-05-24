import { StyleSheet, Text, SafeAreaView, ScrollView, View, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FooterList from "../components/footer/FooterList";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
const Home = () => {
    const [energyData, setEnergyData] = useState([]);
    useEffect(() => {
        fetchEnergy();
    }, []);

    const fetchEnergy = async () => {
        try {
            const { data } = await axios.get('http://172.20.10.3:8000/api/get-energy');
            const energyValues = data.slice(-8).map(item => item.energy);
            console.log(energyValues);
            setEnergyData(energyValues);
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
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
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="energy"
                    yAxisSuffix="kWh"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />: <Text>Loading</Text>}
            </View>
            <FooterList />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    mainText: {
        fontSize: 30,
        textAlign: 'center'
    },
    box: {
        backgroundColor: "black",
        width: '92%',
        height: 280,
        borderRadius: 14,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.0001,
        shadowRadius: 3,
        marginBottom: 20
    },
    boxText: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#171717'
    },
    deviceText: {
        fontSize: 16,
        color: 'darkgray',
        textDecorationLine: 'underline',
        textAlign: 'center',
    }
})

export default Home;