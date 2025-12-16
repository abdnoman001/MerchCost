/**
 * FOB Calculation Logic
 * Ported from Django backend to run locally in React Native
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const calculateFOB = (inputs) => {
    const {
        body_length,
        sleeve_length,
        chest_width,
        gsm,
        wastage_percent,
        yarn_price_per_kg,
        knitting_charge_per_kg,
        dyeing_charge_per_kg,
        aop_print_cost_per_doz,
        accessories_cost_per_doz,
        cm_cost_per_doz,
        commercial_cost_percent,
        profit_margin_percent,
    } = inputs;

    // Step A: Basic Consumption
    // Formula: ((Body_Len + Sleeve_Len + 3cm_allowance) * (Chest + 3cm_allowance) * 2 * GSM * 12) / 10,000,000
    const length_with_allowance = body_length + sleeve_length + 3.0;
    const width_with_allowance = chest_width + 3.0;

    const basic_consumption = (
        length_with_allowance * width_with_allowance * 2 * gsm * 12
    ) / 10000000.0;

    // Step B: Total Fabric Req
    // Basic Consumption + Wastage %
    const total_fabric_req = basic_consumption * (1 + (wastage_percent / 100.0));

    // Step C: Fabric Cost per Doz
    // (Yarn Price + Knitting + Dyeing) * Total Fabric Req
    const fabric_rate_per_kg = (
        yarn_price_per_kg +
        knitting_charge_per_kg +
        dyeing_charge_per_kg
    );
    const fabric_cost_per_doz = fabric_rate_per_kg * total_fabric_req;

    // Step D: Total Cost per Doz
    // Fabric Cost + AOP + Accessories + CM
    const total_cost_per_doz = (
        fabric_cost_per_doz +
        aop_print_cost_per_doz +
        accessories_cost_per_doz +
        cm_cost_per_doz
    );

    // Step E: Final FOB per Pc
    // 1. Add Commercial Cost %
    const cost_with_commercial = total_cost_per_doz * (1 + (commercial_cost_percent / 100.0));

    // 2. Add Profit Margin %
    const final_cost_with_profit = cost_with_commercial * (1 + (profit_margin_percent / 100.0));

    // 3. Divide by 12 to get Price Per Piece
    const fob_per_pc = final_cost_with_profit / 12.0;

    return {
        basic_consumption_kg_doz: parseFloat(basic_consumption.toFixed(4)),
        total_fabric_req_kg_doz: parseFloat(total_fabric_req.toFixed(4)),
        fabric_cost_per_doz: parseFloat(fabric_cost_per_doz.toFixed(2)),
        total_cost_per_doz: parseFloat(total_cost_per_doz.toFixed(2)),
        cost_with_commercial_per_doz: parseFloat(cost_with_commercial.toFixed(2)),
        final_fob_per_pc: parseFloat(fob_per_pc.toFixed(2))
    };
};

/**
 * Save cost sheet to local storage
 */
export const saveCostSheet = async (inputs, breakdown) => {
    try {
        const costSheet = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            inputs,
            breakdown
        };

        // Get existing history
        const historyJson = await AsyncStorage.getItem('cost_sheets_history');
        const history = historyJson ? JSON.parse(historyJson) : [];

        // Add new entry at the beginning
        history.unshift(costSheet);

        // Keep only last 50 entries
        const trimmedHistory = history.slice(0, 50);

        // Save back
        await AsyncStorage.setItem('cost_sheets_history', JSON.stringify(trimmedHistory));

        return costSheet;
    } catch (error) {
        console.error('Error saving cost sheet:', error);
        return null;
    }
};

/**
 * Get cost sheet history
 */
export const getCostSheetHistory = async () => {
    try {
        const historyJson = await AsyncStorage.getItem('cost_sheets_history');
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Error loading history:', error);
        return [];
    }
};
