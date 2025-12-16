import axios from 'axios';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const InputScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        style_name: 'Style-001',
        buyer_name: 'Buyer-A',
        season: 'Summer 24',
        fabric_type: 'Single Jersey',
        gsm: 160,
        body_length: 70,
        sleeve_length: 22,
        chest_width: 52,
        wastage_percent: 10,
        yarn_price_per_kg: 4.5,
        knitting_charge_per_kg: 0.5,
        dyeing_charge_per_kg: 1.2,
        aop_print_cost_per_doz: 0,
        accessories_cost_per_doz: 2.0,
        cm_cost_per_doz: 12.0,
        commercial_cost_percent: 3.0,
        profit_margin_percent: 15.0,
    });

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
                        // Using USB Debugging (adb reverse)
                        const apiUrl = 'http://127.0.0.1:8000/api/cost-sheets/calculate/';
                        const response = await axios.post(apiUrl, formData);

            setLoading(false);
            navigation.navigate('Result', {
                result: response.data,
                inputs: formData
            });
        } catch (error) {
            setLoading(false);
            console.error(error);
            Alert.alert("Error", "Failed to calculate. Check backend connection.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>MerchMate Costing</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Style Info</Text>
                <TextInput style={styles.input} placeholder="Style Name" value={formData.style_name} onChangeText={t => handleChange('style_name', t)} />
                <TextInput style={styles.input} placeholder="Buyer Name" value={formData.buyer_name} onChangeText={t => handleChange('buyer_name', t)} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Fabric Parameters</Text>
                <Text>Fabric Type</Text>
        {/* Temporary replacement for Picker */}
        <TextInput 
            style={styles.input} 
            placeholder="e.g. Single Jersey" 
            value={formData.fabric_type} 
            onChangeText={t => handleChange('fabric_type', t)} 
        />

        <Text>GSM: {formData.gsm}</Text>
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            keyboardType="numeric" 
            value={String(formData.gsm)} 
            onChangeText={t => handleChange('gsm', Number(t))} 
          />
        </View>

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 5 }}>
                        <Text>Body Len (cm)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.body_length)} onChangeText={t => handleChange('body_length', Number(t))} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text>Chest (cm)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.chest_width)} onChangeText={t => handleChange('chest_width', Number(t))} />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 5 }}>
                        <Text>Sleeve Len (cm)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.sleeve_length)} onChangeText={t => handleChange('sleeve_length', Number(t))} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text>Wastage %</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.wastage_percent)} onChangeText={t => handleChange('wastage_percent', Number(t))} />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Costs (USD)</Text>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text>Yarn $/kg</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.yarn_price_per_kg)} onChangeText={t => handleChange('yarn_price_per_kg', Number(t))} />
                    </View>
                    <View style={styles.col}>
                        <Text>Knit $/kg</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.knitting_charge_per_kg)} onChangeText={t => handleChange('knitting_charge_per_kg', Number(t))} />
                    </View>
                    <View style={styles.col}>
                        <Text>Dye $/kg</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.dyeing_charge_per_kg)} onChangeText={t => handleChange('dyeing_charge_per_kg', Number(t))} />
                    </View>
                </View>

                <Text>Other Costs (per Doz)</Text>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text>AOP</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.aop_print_cost_per_doz)} onChangeText={t => handleChange('aop_print_cost_per_doz', Number(t))} />
                    </View>
                    <View style={styles.col}>
                        <Text>Accessories</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.accessories_cost_per_doz)} onChangeText={t => handleChange('accessories_cost_per_doz', Number(t))} />
                    </View>
                    <View style={styles.col}>
                        <Text>CM</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={String(formData.cm_cost_per_doz)} onChangeText={t => handleChange('cm_cost_per_doz', Number(t))} />
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>CALCULATE FOB</Text>}
            </TouchableOpacity>
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    section: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#444' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 10, backgroundColor: '#fafafa' },
    pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    col: { flex: 1, marginHorizontal: 2 },
    button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default InputScreen;
