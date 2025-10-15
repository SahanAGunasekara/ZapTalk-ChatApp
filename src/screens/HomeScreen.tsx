import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLayoutEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { useWebSocketPing } from "../socket/useWebSocketPing";

const chats = [
  {
    id: 1,
    name: "Sahan Perera",
    lastMessage: "Hello, Kamal",
    time: "9:46 pm",
    unread: 2,
    profile: require("../../assets/avatar/avatar_1.png"),
  },
  {
    id: 2,
    name: "Fathima",
    lastMessage: "Hello, Sahn. Oyata kohomada",
    time: "Yesterday",
    unread: 0,
    profile: require("../../assets/avatar/avatar_2.png"),
  },
  {
    id: 3,
    name: "Nayana",
    lastMessage: "Hello, Kamal",
    time: "2025/9/24",
    unread: 2,
    profile: require("../../assets/avatar/avatar_3.png"),
  },
  {
    id: 4,
    name: "Tharaka Sankalpa Sir",
    lastMessage: "Sir,",
    time: "10.00 pm",
    unread: 1,
    profile: require("../../assets/avatar/avatar_4.png"),
  },
  {
    id: 5,
    name: "Pansilu Piyumantha ACH",
    lastMessage: "Mokada Karanne",
    time: "2025/09/20",
    unread: 2,
    profile: require("../../assets/avatar/avatar_5.png"),
  },
  {
    id: 6,
    name: "Hasitha Lakmal",
    lastMessage: "Mokada karanne Anjana",
    time: "2025/09/18",
    unread: 2,
    profile: require("../../assets/avatar/avatar_6.png"),
  },
  {
    id: 7,
    name: "Hasitha Lakmal",
    lastMessage: "Mokada karanne Anjana",
    time: "2025/09/18",
    unread: 2,
    profile: require("../../assets/avatar/avatar_6.png"),
  },
  {
    id: 8,
    name: "Hasitha Lakmal",
    lastMessage: "Mokada karanne Anjana",
    time: "2025/09/18",
    unread: 2,
    profile: require("../../assets/avatar/avatar_6.png"),
  },
];

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

export default function HomeScreen() {
  useWebSocketPing(1000*60*2);
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");

  const chatList = useChatList();
  const [isModalVisible, setModalVisible] = useState(false);
  

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ZapTalk",
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
      headerRight: () => (
        <View className="flex-row space-x-4">
          <TouchableOpacity className="me-5">
            <Ionicons name="camera" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>

          <Modal
            animationType="fade"
            visible={isModalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              className="flex-1 bg-transparent"
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                }}
              >
                <View className="justify-end items-end p-5">
                  <View className="bg-white rounded-md w-72 p-3" 
                  style={{ 
                    shadowColor:"#000",
                    shadowOffset:{width:0,height:2},
                    shadowOpacity:0.25,
                    shadowRadius:3.84,
                    elevation:5,
                   }}>
                    <TouchableOpacity className="h-14 my-2 justify-center items-start border-b-2 border-b-gray-100"
                      onPress={()=>{navigation.navigate("SettingScreen");
                        setModalVisible(false);
                      }}
                    >
                      <Text className="font-bold text-lg">Setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="h-14 my-2 justify-center items-start border-b-2 border-b-gray-100"
                      onPress={()=>{navigation.navigate("ProfileScreen");
                        setModalVisible(false);
                      }}
                    >
                      <Text className="font-bold text-lg">My Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="h-14 my-2 justify-center items-start border-b-2 border-b-gray-100"
                      onPress={()=>{navigation.navigate("SignOutScreen");
                        setModalVisible(false);
                      }}
                    >
                      <Text className="font-bold text-lg">SignOut</Text>
                    </TouchableOpacity>
                  </View>
                  
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      ),
      contentStyle: { marginBottom: 0 },
    });
  }, [navigation, isModalVisible]);

  const filterdChats = [...chatList]
    .filter((chat) => {
      //console.log(chat.frie)
      return (
        chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      className="flex-row items-center py-2 px-3 bg-gray-50 my-0.5"
      onPress={() => {
        navigation.navigate("SingleChatScreen", {
          chatId: item.friendId,
          chatName: item.friendName,
          lastSeenTime: formatChatTime(item.lastTimeStamp),
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
        });
      }}
    >
      <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 justify-center items-center">
        {item.profileImage ? (
          <Image
            source={{ uri: item.profileImage }}
            className="h-14 w-14 rounded-full"
          />
        ) : (
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
            }}
            className="h-14 w-14 rounded-full"
          />
        )}
      </TouchableOpacity>
      <View className="flex-1 ms-3">
        <View className="flex-row justify-between">
          <Text
            className="font-bold text-xl text-gray-600"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.friendName}
          </Text>
          <Text className="font-bold text-xs text-gray-500">
            {formatChatTime(item.lastTimeStamp)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className="text-gray-500 flex-1 text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View className="bg-green-500 rounded-full px-2 py-2 ms-2">
              <Text className="text-slate-50 text-xs font-bold">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-white p-0"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar hidden={false} />
      <View className="items-center flex-row mx-2 border-gray-300 border-2 rounded-full px-3 h-14 mt-3">
        <Ionicons name="search" size={20} color={"gray"} />
        <TextInput
          className="flex-1 text-lg font-bold ps-2"
          placeholder="Search"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>
      <View className="mt-1">
        <FlatList
          data={filterdChats}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
      <View className="absolute bg-sky-700 bottom-16 right-12 h-20 w-20 rounded-3xl">
        <TouchableOpacity
          className="h-20 w-20 rounded-3xl justify-center items-center"
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <MaterialCommunityIcons name="comment-plus" size={26} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
