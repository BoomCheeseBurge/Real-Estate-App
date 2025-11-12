import Slider from '@/components/Slider'
import { ImageSlider } from '@/constants/SliderData'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Test = () => {
  return (
    <View style={styles.container}>
      <Slider itemList={ImageSlider} />
    </View>
  )
}

export default Test

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 120,
    }
})