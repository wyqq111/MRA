import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Picker, Text,Button} from '@tarojs/components';
import './index.css';

// 座位图片路径
const seatImages = {
  available2: require('../../images/chair.png'),
  available4: require('../../images/people.png'),
  occupied2: require('../../images/chair (1).png'),
  occupied4: require('../../images/people (1).png'),
  selected2: require('../../images/chair (2).png'),
  selected4: require('../../images/people (2).png'),
  unavailable2: require('../../images/chair (3).png'),
  unavailable4: require('../../images/people (3).png')
};

// 固定的桌子布局编号（前15号桌在左侧）
const tableLayout = [
  'available2', 'available2', 'available2', 'available2', 'available2',
  'available2', 'available2', 'available2', 'available2', 'available2',
  'available2', 'available2', 'available2', 'available2', 'available2',
  'available4', 'available4', 'available4', 'available4', 'available4',
  'available4', 'available4', 'available4', 'available4', 'available4',
  'available4', 'available4', 'available4', 'available4', 'available4',
  'available4', 'available4', 'available4', 'available4', 'available4',
  'available4', 'available4', 'available2', 'available2', 'available2'
];

// 给每个座位分配一个固定编号
const seatNumbers = Array.from({ length: 40 }, (_, index) => index + 1);

const Choose = () => {
  const [seats, setSeats] = useState([]);
  const [peopleCount, setPeopleCount] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const initializedSeats = generateSeats();
    setSeats(initializedSeats);
  }, []);

  useEffect(() => {
    if (peopleCount !== null) {
      updateSeatsBasedOnCount();
    }
  }, [peopleCount]);

  const generateSeats = () => {
    const seats = [...tableLayout];
    const occupiedCount = Math.floor(Math.random() * 20) + 1;
    let occupiedIndexes = new Set();

    while (occupiedIndexes.size < occupiedCount) {
      occupiedIndexes.add(Math.floor(Math.random() * seats.length));
    }

    occupiedIndexes.forEach(index => {
      if (seats[index].includes('2')) {
        seats[index] = 'occupied2';
      } else if (seats[index].includes('4')) {
        seats[index] = 'occupied4';
      }
    });

    return seats;
  };

  const updateSeatsBasedOnCount = () => {
    const updatedSeats = seats.map((seat) => {
      if (!seat) return 'available2'; // Default to available2 if seat is undefined

      if (peopleCount <= 2) {
        if (seat.includes('4') && !seat.includes('occupied')) return 'unavailable4';
        if (seat.includes('2') && seat.includes('unavailable')) return 'available2';
      } else {
        if (seat.includes('2') && seat.includes('available')) return 'unavailable2';
        if (seat.includes('4') && seat.includes('unavailable')) return seat.includes('occupied') ? 'occupied4' : 'available4';
      }
      return seat;
    });

    setSeats(updatedSeats);
    if (peopleCount <= 2) {
      setSelectedSeats(prevSeats => prevSeats.filter(seat => updatedSeats[seat - 1]?.includes('2')));
    } else {
      setSelectedSeats(prevSeats => prevSeats.filter(seat => updatedSeats[seat - 1]?.includes('4')));
    }
  };

  const handleSeatClick = (index) => {
    const seat = seats[index - 1]; // Adjust for zero-based index
    if (!seat || seat.includes('occupied') || seat.includes('unavailable') || peopleCount === null) return;

    const seatType = seat.includes('2') ? '2' : '4';

    const newSeats = [...seats];

    if (seat.includes('available')) {
      // If there is already a selected seat, revert its status
      if (selectedSeats.length > 0) {
        const previousSelectedSeatIndex = selectedSeats[0] - 1;
        newSeats[previousSelectedSeatIndex] = `available${seats[previousSelectedSeatIndex].includes('2') ? '2' : '4'}`;
        setSelectedSeats([]);
      }

      // Set the new seat as selected
      newSeats[index - 1] = `selected${seatType}`;
      setSelectedSeats([seatNumbers[index - 1]]);
    }

    setSeats(newSeats);
  };

  const handlePickerChange = (e) => {
    const selectedValue = parseInt(e.detail.value, 10) + 1;
    setPeopleCount(selectedValue);
  };

  const getSeatImage = (seatNumber) => {
    const seat = seats[seatNumber - 1]; // Adjust for zero-based index
    if (!seat) return seatImages['available2']; // Default to available2 if seat is undefined

    const seatType = seat.includes('2') ? '2' : '4';

    if (seat.includes('selected')) {
      return seatImages[`selected${seatType}`];
    } else if (seat.includes('occupied')) {
      return seatImages[`occupied${seatType}`];
    } else if (seat.includes('unavailable')) {
      return seatImages[`unavailable${seatType}`];
    } else {
      return seatImages[`available${seatType}`];
    }
  };

  const getSeatStatus = (seatNumber) => {
    const seat = seats[seatNumber - 1];
    if (!seat) return 'available2'; 

    if (seat.includes('selected')) {
      return 'selected';
    } else if (seat.includes('occupied')) {
      return 'occupied';
    } else if (seat.includes('unavailable')) {
      return 'unavailable';
    } else {
      return 'available';
    }
  };
  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      Taro.showToast({
        title: '请先选择座位',
        icon: 'none'
      });
      return;
    }
  
    Taro.showToast({
      title: '选座成功，开始点餐吧',
      icon: 'success',
      duration: 2000
    });
  
    const selectedSeatNumber = selectedSeats[0]; // 获取选择的座位号
    const app = Taro.getApp();
    app.setGlobalData({ selectedSeat: selectedSeatNumber });
   
    Taro.switchTab({
      url: `/pages/dining/index`
    });
  };
  return (
    <View className='container'>
      <View className='header'>
        <View className='selected-count'>
          选择的桌号: {selectedSeats.join(', ') || '无'}
        </View>
        <View className='right-section'>
          <Picker mode='selector' range={[1, 2, 3, 4]} onChange={handlePickerChange}>
            <View className='picker'>
              <Text>人数: {peopleCount !== null ? peopleCount : '未选择'}</Text>
            </View>
          </Picker>
          <Image className='header-image' src={require('../../images/cooking.png')} />
        </View>
      </View>

      <View className='status-container'>
        <View className='status-item'>
          <Image className='status-image' src={require('../../images/128.png')} />
          <Text className='status-text'>可选</Text>
        </View>
        <View className='status-item'>
          <Image className='status-image' src={require('../../images/128 (2).png')} />
          <Text className='status-text'>有人</Text>
        </View>
        <View className='status-item'>
          <Image className='status-image' src={require('../../images/128 (1).png')} />
          <Text className='status-text'>不可选</Text>
        </View>
        <View className='status-item'>
          <Image className='status-image' src={require('../../images/128 (3).png')} />
          <Text className='status-text'>我的选择</Text>
        </View>
      </View>

      <View className='main-content'>
        <View className='left-side'>
         
          <View className='left-column'>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <View key={rowIndex} className='seat-wrapper'>
                <Image
                  src={getSeatImage(rowIndex + 1)}
                  className='seat'
                  onClick={() => handleSeatClick(rowIndex + 1)}
                  style={{ pointerEvents: getSeatStatus(rowIndex + 1) === 'unavailable' || getSeatStatus(rowIndex + 1) === 'occupied' ? 'none' : 'auto' }}
                />
                <Text className='seat-number'>{rowIndex + 1}</Text>
              </View>
            ))}
          </View>
         
          <View className='left-column'>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <View key={rowIndex + 10} className='seat-wrapper'>
                <Image
                  src={getSeatImage(rowIndex + 11)}
                  className='seat'
                  onClick={() => handleSeatClick(rowIndex + 11)}
                  style={{ pointerEvents: getSeatStatus(rowIndex + 11) === 'unavailable' || getSeatStatus(rowIndex + 11) === 'occupied' ? 'none' : 'auto' }}
                />
                <Text className='seat-number'>{rowIndex + 11}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='right-side'>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <View key={rowIndex} className='right-row'>
              {Array.from({ length: 4 }).map((_, colIndex) => {
                const seatNumber = 21 + (rowIndex * 4) + colIndex;
                return (
                  <View key={colIndex} className='seat-wrapper'>
                    <Image
                      src={getSeatImage(seatNumber)}
                      className='seat'
                      onClick={() => handleSeatClick(seatNumber)}
                      style={{ pointerEvents: getSeatStatus(seatNumber) === 'unavailable' || getSeatStatus(seatNumber) === 'occupied' ? 'none' : 'auto' }}
                    />
                    <Text className='seat-number'>{seatNumber}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
      <View className='confirm-button-wrapper'>
        <Button className='confirm-button' onClick={handleConfirm}>确定选座</Button>
      </View>
    
    </View>
  );
};

export default Choose;
