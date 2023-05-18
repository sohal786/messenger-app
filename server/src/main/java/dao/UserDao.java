package dao;

import com.mongodb.client.MongoCollection;
import dto.UserDto;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.conversions.Bson;

public class UserDao extends BaseDao<UserDto> {

  private static UserDao instance;

  private UserDao(MongoCollection<Document> collection){
    super(collection);
  }

  public static UserDao getInstance(){
    if(instance != null){
      return instance;
    }
    instance = new UserDao(MongoConnection.getCollection("UserDao"));
    return instance;
  }

  public static UserDao getInstance(MongoCollection<Document> collection){
    instance = new UserDao(collection);
    return instance;
  }

  @Override
  public void put(UserDto messageDto) {
    collection.insertOne(messageDto.toDocument());
  }


  // Function to update user's profile image
  public void changeProfilePic(Document foundDocument, String profilePic) {

    // Search for the document in the database with this userName
    //var foundUser = getInstance();

    //System.out.println("Change profile pic is searching for: " + userName);
    //var foundUser = (Document) collection.find(new Document("userName", userName));
    //System.out.println("Change profile pic found user: " + foundUser);

    // This should set the profilePic of this to the input one
    Bson newValue = new Document("profilePic", profilePic);
    System.out.println("Change profile pic new value is " + newValue);
    Bson setNewValueInDatabase = new Document("$set", newValue);
    System.out.println("Change profile pic setNewValueInDatabase is " + setNewValueInDatabase);

    // Update the input userName in the collection with the new input profilePic value
    collection.updateOne(foundDocument, setNewValueInDatabase);
    System.out.println("User profile picture updated to " + profilePic);
  }


  public List<UserDto> query(Document filter){
    return collection.find(filter)
        .into(new ArrayList<>())
        .stream()
        .map(UserDto::fromDocument)
        .collect(Collectors.toList());
  }

}
