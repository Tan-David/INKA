import React from 'react';
import {
  StyleSheet, View, ScrollView, Image, Dimensions, ImageBackground, TouchableOpacity, FlatList, Animated, Platform,
  AsyncStorage, Subheading
} from 'react-native';
import {
  TextInput, Divider, Button, Title, Surface, Avatar, Headline, Card, Portal, List, ActivityIndicator, Paragraph,
  Appbar, TouchableRipple, Colors, IconButton, Text, Dialog, Caption,
} from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { MapView, Permissions, Location } from 'expo';

export default class Merchantinfo extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  state = {
    email: '',
    password: '',
    confirmpassword: '',
    page: 1,
    seed: 1,
    error: null,
    refreshing: false,
    data: [],
    scrollY: new Animated.Value(0),
    open: false,
    buttonlabel: false,
    isliked: false,
    longitude: this.props.navigation.state.params.longitude,
    latitude: this.props.navigation.state.params.latitude,
    couponlongitude: 0,
    couponlatitude: 0,
    GrabVisible: false,
    branches: [],
    contactlist: [],
    pageloading: true
  };

  componentDidMount() {
    this.GetBusinessbyId();
  }

  changestate() {
    this.setState({ buttonlabel: !this.state.buttonlabel });
  }

  GrabCoupon = async () => {
    const value = await AsyncStorage.getItem('devicetoken');

    fetch("http://Inkafoodapp.com/Api/Consumer/Coupon/Acquire",
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + value,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          couponId: this.props.navigation.state.params.couponinfo.couponId, businessId: this.state.data.businessId
        })
      })
      .then((response) => response.json())
      .then((result => {
        console.log(result);
        this.setState({ buttonlabel: !this.state.buttonlabel });
      }))
      .catch((error) => {
        console.log(error);
        alert(error)
      });

  }

  GetBusinessbyId = async () => {
    this.setState({pageloading: true})
    const value = await AsyncStorage.getItem('devicetoken');
    fetch(`http://Inkafoodapp.com/Api/Account/Business/${this.props.navigation.state.params.businessId}/`,
      {
        headers: {
          'Authorization': 'Bearer ' + value,
          'content-type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((result => {
        this.setState({ data: result });
        this.setState({ couponlongitude: result.branches[0].longitude });
        this.setState({ couponlatitude: result.branches[0].latitude });
        this.setState({ branches: result.branches }) 
        this.setState({contactlist: result.contactNumbers}) 
        this.setState({pageloading: false})
      }))
      .catch((error) => {
        console.log(error);
        alert(error)
      });
  }

  LikeCoupon = async () => {
    const value = await AsyncStorage.getItem('devicetoken');
    fetch(`http://Inkafoodapp.com/Api/Consumer/Like`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + value,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ entityType: 1, entityId: this.props.navigation.state.params.businessId })
      })
      .then((response) => response.json())
      .then((result => {
        console.log(result)
        this.setState({ isliked: !this.state.isliked })

      }))
      .catch((error) => {
        console.log(error);
        alert(error)
      });
  }

  _showDialog = () => this.setState({ GrabVisible: true });

  _hideDialog = () => this.setState({ GrabVisible: false });

  WholeNews() {
    return this.state.branches.map(function (item, i) {
      return (
        <List.Item
          key={i}
          title={item.address}
        />
      );
    });
  }

  contactlist(){
    return this.state.contactlist.map((item, key)=>(
      <List.Item
      key={key}
      title={item}
    />)
    )}

  render() {

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });
    const titleScale = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });

    let screenwidth = Dimensions.get('window').width;
    if (this.state.pageloading === true)
    return(
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} animating={true} color={Colors.red800} /> 
      </View>
    )
    else

    return (

      <View style={styles.scrollviewcontainer}>

        <Animated.ScrollView

          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true })}
        >

          <View style={styles.scrollViewContent}>

            <View style={{ margin: 10, }}>
              < View style={{ justifyContent: "space-around", alignItems: "center", margin: 10 }}>
                <Surface style={styles.surface2}>
                  <Text style={{ fontFamily: 'HelveticaNeueBold', fontWeight: 'bold', fontSize: 35, margin: 10 }}>{this.state.data.name}</Text>
                  <Divider />
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-around", alignItems: "center" }}>
                    <Button icon="favorite" mode="text"  >{this.state.data.likes}</Button>
                    <Button icon="share" mode="text"  >{this.state.data.shares}</Button>
                    <Button icon="star" mode="text"  >{this.state.data.ratings}</Button>
                    <Button mode="text" icon="location-on" >{this.props.navigation.state.params.businessinfo.distanceToString}</Button>
                  </View>

                  <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
                    <Button mode={this.state.isliked ? "contained" : 'outlined'} icon={this.state.isliked ? "favorite" : 'favorite-border'} style={{ height: 40, width: 100, borderRadius: 100 }} onPress={() => this.LikeCoupon()}>
                      Like</Button>
                    <Button mode="outlined" icon="pin-drop" style={{ height: 40, width: 100, borderRadius: 100 }} onPress={() => this._showDialog()} >
                      Check In</Button>
                    <Button mode="outlined" icon="share" style={{ height: 40, width: 100, borderRadius: 100 }}>Share</Button>

                  </View>
                </Surface>
              </View>

              <Divider />
              <List.Section>
                <Text style={styles.titlestyle}>Business Details</Text>
                <List.Item
                  title={this.state.data.description}
                />
                <List.Item
                  title={"Open:" + this.state.data.operatingHrs}
                />
              </List.Section>

              <Divider />
              <Text style={styles.titlestyle}>Address</Text>
              <List.Item 
                description={this.state.data.address}
              />

              <MapView
                showsUserLocation={true}
                style={{ flex: 1, width: '100%', height: 200 }}
                region={{
                  latitude: this.state.couponlatitude,
                  longitude: this.state.couponlongitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              />

              <List.Section>
                <Text style={styles.titlestyle}>Branches</Text>
                {this.WholeNews()}
              </List.Section>

              <Divider />

              <List.Section>
                <Text style={styles.titlestyle}>Contact Info</Text>

                {this.contactlist()}
                
                <List.Item
                  title={"Email: " + this.state.data.email}
                />
                <List.Item
                  title={"Website: " + this.state.data.website}
                />
              </List.Section>
            </View>

            <Divider />


            <Text style={styles.otherofferstyle}>Other Offers</Text>
            <FlatList
              style={{ marginBottom: 10 }}
              data={this.state.data.coupons}
              keyExtractor={item => item.couponId.toString()}
              numColumns={2}
              initialNumToRender={6}
              removeClippedSubviews={true}
              renderItem={({ item }) => (
                <View style={styles.cardrender2}>
                  <Card style={styles.cardstyle2} >
                    <TouchableRipple
                      onPress={() => this.props.navigation.push("Dealinfo", {
                        couponinfo: item,
                        longitude: this.state.longitude,
                        latitude: this.state.latitude,
                      })}
                      rippleColor="rgba(0, 0, 0, .32)"
                    >
                      <Card.Cover source={{ uri: item.imageUrl }} />
                    </TouchableRipple>
                    <Card.Content>
                      <Paragraph style={styles.paragraphstyle2}>{item.name}</Paragraph>
                      <Caption>{item.businessName}</Caption>
                    </Card.Content>
                    <Card.Actions>
                      <Button icon="location-on">
                        {item.distanceToString}
                      </Button>
                      <Caption>|</Caption>
                      <Button icon="favorite">
                        {item.likes}
                      </Button>
                    </Card.Actions>
                  </Card>
                </View>
              )}
            />
          </View>
        </Animated.ScrollView>

        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <Animated.Image style={[
            styles.backgroundImage,
            { opacity: imageOpacity, transform: [{ translateY: imageTranslate }] },
          ]} source={{ uri: this.state.data.coverPhotoUrl }} />

          <TouchableRipple>
            <Avatar.Image size={100} style={{ position: 'absolute', top: 30, right: 20 }} source={{ uri: this.state.data.profileImageUrl }} />
          </TouchableRipple>
        </Animated.View>

        <Animated.View
          style={[
            styles.bar,
            {
              transform: [
                { scale: titleScale },
                { translateY: titleTranslate },
              ],
            },
          ]}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Button style={{ color: '#fff', height: 25, width: 25 }} color={Colors.white}
              icon={() => <Icon size={30} name="keyboard-backspace" color={'white'} />}
              mode="text" onPress={() => this.props.navigation.goBack()} />
          </View>

        </Animated.View>

        <Portal>
          <Dialog
            visible={this.state.GrabVisible}
            onDismiss={this._hideDialog}>
            <Dialog.Title>Grab Coupon</Dialog.Title>
            <Dialog.Content>
              <Paragraph>You Have Checked in to this Location!</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._hideDialog}>Close</Button> 
            </Dialog.Actions>
          </Dialog>
        </Portal>

      </View>
    );
  }
}
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const styles = StyleSheet.create({
  scrollviewcontainer: {
    flex: 1,
  },
  paragraphstyle: {
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'right',
    fontWeight: 'bold',
    right: 0
  },
  cardstyle: {
    padding: 5,
    borderRadius: 10,
    height: 30,
    width: 20,
    borderRadius: 60
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#CA2D40',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    marginTop: 20,
    backgroundColor: 'transparent',
    height: 40,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 34,
  },
  surface: {
    padding: 8,
    height: 50,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderRadius: 15
  },
  surface2: {
    padding: 10,
    height: 200,
    width: '100%',
    justifyContent: 'center',
    margin: 10,
    elevation: 2,
    borderRadius: 15
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  titlestyle: {
    fontFamily: 'HelveticaNeueBold',
    fontSize: 25,
    marginBottom: 10,
    marginLeft: 10,
  },
  otherofferstyle: {
    fontFamily: 'HelveticaNeueBold',
    fontSize: 25,
    margin: 15
  },
  cardrender2: {
    flex: 1,
    margin: 5
  },
  cardstyle2: {
    elevation: 2
  },
  paragraphstyle2: {
    fontWeight: 'bold',
    color: '#CA2D40'
  },
});