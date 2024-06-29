/* @flow */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FooterList from '../components/footer/FooterList';
import { DataTable } from 'react-native-paper';

const App = () => {
  const [monthlyEnergyData, setMonthlyEnergyData] = useState([]);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  useEffect(() => {
    fetchMonthlyEnergy();
  }, []);

  const fetchMonthlyEnergy = async () => {
    try {
      const { data } = await axios.get('http://192.168.0.105:8000/api/get-monthlyenergy');
      const latestData = data.slice(-6).reverse();
      setMonthlyEnergyData(latestData);
    } catch (err) {
      console.error(err);
    }
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
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <ScrollView style={{ marginVertical: 10 }} >
        <Text style={styles.mainText}>CONSUMPTION HISTORY</Text>
        <DataTable>
          <DataTable.Header style={{ backgroundColor: '#4169e1' }}>
            <DataTable.Title style={styles.tableHeader}><Text style={styles.tableHeaderText}>Time</Text></DataTable.Title>
            <DataTable.Title numeric ><Text style={styles.tableHeaderText}>Consumption</Text></DataTable.Title>
            <DataTable.Title numeric ><Text style={styles.tableHeaderText}>Cost</Text></DataTable.Title>
          </DataTable.Header>
          {monthlyEnergyData.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={styles.tableCell}><Text style={styles.tableCellText}>{month[item.month - 1] + ', ' + item.year}</Text></DataTable.Cell>
              <DataTable.Cell numeric ><Text style={styles.tableCellText}>{Math.round(item.energyMonth1 + item.energyMonth2) + ' kWh'}</Text></DataTable.Cell>
              <DataTable.Cell numeric ><Text style={styles.tableCellText}>{formatNumber(Math.round(calculateBill(item.energyMonth1 + item.energyMonth2))) + ' VND'}</Text></DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
      <FooterList />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  mainText: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10
  },
  tableHeader: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  tableCell: {
    justifyContent: 'center', // Căn giữa nội dung trong ô bảng
    alignItems: 'center', // Căn giữa nội dung trong ô bảng
  },
  tableCellText: {
    textAlign: 'center', // Căn giữa nội dung trong ô bảng
  },
  tableHeaderText: { // Style cho text trong header
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16 // In đậm text
  }
});

export default App;