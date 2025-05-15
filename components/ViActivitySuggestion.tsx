import {
    View, 
    Text,
    StyleSheet,
    TouchableNativeFeedback,
    ViewStyle
} from "react-native";

import {
    BatteryLow,
    BatteryMedium,
    BatteryHigh,
    Clock,
    CurrencyEur,
    MapPin,
    Users,
    Boot,
    SwimmingPool,
    Desktop
} from "phosphor-react-native";
import { SvgProps } from "react-native-svg";

import { Tag } from "./ViCategoryTag";

const globStyles = require("../globalStyles");


interface ViAcitivityCardProps {
    title: string;
    tags: string[];
    energylevel: 'Low' | 'Medium' | 'High';
    duration: string;
    cost: string;
    distance: string;
    shareable: boolean;
    onPress: () => void;
    style?: ViewStyle;
    activityType: string;
}

function getActivityIcon(type:string){
    switch(type) {
        case 'hiking':
            return <Boot size={32} />;
        case 'swimming':
            return <SwimmingPool size={32} />;
        case 'coding':
            return <Desktop size={32} />;
        default:
            return <Users size={32} />; 
    }
}

export function ViActivitySuggestion({
    title,
    tags,
    energylevel,
    duration,
    cost,
    distance,
    shareable,
    onPress,
    style,
    activityType
}: ViAcitivityCardProps) {
    return (
        <TouchableNativeFeedback style={{
            width: '100%',
            flex:1
        }} onPress={onPress}>
            <View style={[styles.card, style]}>
            <View style={styles.header}>
                {getActivityIcon(activityType)}
                <Text style={globStyles.bodyLarge}>{title}</Text>
             </View>
                <View style={styles.tagsContainer}>
                    {tags.map((tag, idx) => (
            <Tag key={idx} label={tag} />
          ))}
        </View>
                <View style={styles.details}>
                    <View style={styles.detail}>
                        {energylevel === 'Low' ? <BatteryLow size={16} /> : energylevel === 'Medium' ? <BatteryMedium size={16} /> : <BatteryHigh size={16} />}
                        <Text style={globStyles.bodySmall}>{energylevel}</Text>
                    </View>
                    <View style={styles.detail}>
                        <Clock size={16} />
                        <Text style={globStyles.bodySmall}>{duration}</Text>
                    </View>
                    <View style={styles.detail}>
                        <CurrencyEur size={16} />
                        <Text style={globStyles.bodySmall}>{cost}</Text>
                    </View>
                    <View style={styles.detail}>
                        <MapPin size={16} />
                        <Text style={globStyles.bodySmall}>{distance}</Text>
                    </View>
                    <View style={styles.detail}>
                        <Users size={16} />
                        <Text style={globStyles.bodySmall}>{shareable}</Text>
                    </View>
                    
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: 16,
        backgroundColor: '#fff',
        padding: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8
      },
    details: {
        marginTop: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detail: {
        marginBottom: 4,
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center'
    },
    tagsContainer: {
        marginTop: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4
    }
    
});





