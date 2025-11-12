import { ImageSliderType } from '@/constants/SliderData';
import React, { useRef, useState } from 'react';
import { View, ViewToken } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import SliderItem from './SliderItem';
import SliderPagination from './SliderPagination';

type Props = {
    itemList: ImageSliderType[];
}

const Slider = ({ itemList }: Props) => {

    // Animated FlatList setup
    const scrollX = useSharedValue(0);
    const [paginationIndex, setPaginationIndex] = useState(0);
    const [data, setData] = useState(itemList);

    // Handlers for scroll and viewable items
    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        }
    });

    // Viewable items change handler
    const onViewableItemsChanged = ({viewableItems} : { viewableItems: ViewToken[]}) => {
        
        // Update pagination index based on the first viewable item
        if(viewableItems[0].index !== undefined && viewableItems[0].index !== null) {
            // Use modulo to cycle through the original itemList length
            setPaginationIndex(viewableItems[0].index % itemList.length);
        }
    }

    // Viewability configuration
    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    }

    // Viewability configuration callback pairs
    const viewabilityConfigCallbackPairs = useRef([
        {viewabilityConfig, onViewableItemsChanged}
    ]);

    return (
        <View>
            <Animated.FlatList 
                data={data}
                renderItem={({item, index}) => <SliderItem item={item} index={index} scrollX={scrollX} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onScroll={onScrollHandler}
                scrollEventThrottle={16}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                onEndReached={() => setData([...data, ...itemList])}
                onEndReachedThreshold={0.5}
                // removeClippedSubviews={false}
            />
            <SliderPagination items={itemList} scrollX={scrollX} paginationIndex={paginationIndex} />
        </View>
    )
}

export default Slider