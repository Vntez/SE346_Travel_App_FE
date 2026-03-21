import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        margin: 10,
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Phủ toàn bộ ImageBackground
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu đen với độ trong suốt 50%
    },
    containerChild: {
        margin: 10,
        marginTop: 10,
        justifyContent: 'center',
        rowGap: 10
    },
    imageFrame: {
        width: 360,
        height: 180,
        borderWidth: 2,
        borderColor: "#ddd",
        backgroundColor: "#fff",
        borderRadius: 20,
        overflow: "hidden",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
        margin: 10,
    },

    containerGG_Apple: {
        flexDirection: 'row',
        columnGap: 30,
    },
    checkbox: {
        marginRight: 10,
        width: 20,
        height: 20,
        borderRadius: 5,
        borderColor: '#ddd',
    },
    linkText: {
        color: '#00AEEF',
        fontWeight: '500',
    },
    containerImageGG_Apple: {
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'center'
    },
    buttonGG_Apple: {
        borderRadius: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,

    },
    buttonGG_AppleText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#47CCF0',
        paddingVertical: 15,
        width: 350,
        borderRadius: 50, // Bo tròn hoàn toàn hai đầu
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        color: '#7e7e7e',
        fontSize: 15,
        //  fontWeight: 'bold',
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%', 
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#7e7e7e',
    },
})

export default styles;