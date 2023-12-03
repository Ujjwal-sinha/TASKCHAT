import HashMap "mo:base/HashMap";
import Bool "mo:base/Bool";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import List "mo:base/List";
import Hash "mo:base/Hash";

actor UserRegistration {

  // Creating two arrays to store pending and completed tasks
  var pendingTodo : [Text] = [];
  var completedTodo : [Text] = [];

  type User = {
    username : Text;
    pass : Text;
    pendingTodo : [Text];
    completedTodo : [Text];
  };

  // create hashmap to store data with every uniquer username
  let usersByUsername = HashMap.HashMap<Text, User>(0, Text.equal, Text.hash);
  var currentUser : Text = "";

  // Function to check if a username is taken
  public query func isUsernameTaken(username : Text) : async Bool {
    let value : Bool = switch (usersByUsername.get(username)) {
      case (null) {
        return false;
      };
      case _ {
        return true;
      };
    };
    return value;
  };

  // this function will return the password from backend to frontend
  public func isCorrectPassword(username : Text, password: Text) : async Text {
    switch (usersByUsername.get(username)) {
      case (null) {
        return "User doesn't exist";
      };
      case (?result) {
        if(result.pass == password) {
          currentUser := username;
          return "Success";
        };
        return "Username or Password is incorrent";
      };
    };
  };

  // Function to register a new user
  public func registerUser(users : Text, password : Text) : async Bool {
    let value : Bool = switch (usersByUsername.get(users)) {
      case (null) {
        let newuser : User = {
          username = users;
          pass = password;
          pendingTodo = [];
          completedTodo = [];
        };
        usersByUsername.put(users, newuser);
        return true;
      };
      case _ {
        return false;
      };
    };
    return value;
  };


  public func getCurrentUser() : async Text {
    return currentUser;
  };

  // function to add task in pending list
  public func addinPendingList(value : Text) : async () {
    switch (usersByUsername.get(currentUser)) {
      case (?user) {
        let updatedPendingTodo = Array.append(user.pendingTodo, [value]);
        usersByUsername.put(currentUser, { user with pendingTodo = updatedPendingTodo });
      };
      case (null) {
        Debug.print("User not find");
      };
    };
  };

  // function to fetch pending todo list
  public func getPendingtodo() : async [Text] {
    switch (usersByUsername.get(currentUser)) {
      case (?user) {
        return user.pendingTodo;
      };
      case (null) {
        return [];
      };
    };
  };

  // function to add task in completed list but at first remove the task from pending task list
  public func addinCompletedList(value : Text) : async () {
    switch (usersByUsername.get(currentUser)) {
      case (?user) {
        let pendingTasks = user.pendingTodo;
        let completedTasks = user.completedTodo;
        let newPendingTasks = Buffer.Buffer<Text>(pendingTasks.size() -1);

        for (i in pendingTasks.vals()) {
          if (i == value) {

          } else {
            newPendingTasks.add(i);
          };
        };
        // Remove the task from pendingTodo
        let updatedPendingTodo = newPendingTasks.toArray();
        // Add the task to completedTodo
        let updatedCompletedTodo = Array.append(completedTasks, [value]);
        usersByUsername.put(
          currentUser,
          {
            user with
            pendingTodo = updatedPendingTodo;
            completedTodo = updatedCompletedTodo;
          },
        );
      };
      case (null) {
        Debug.print("User not find");
      };
    };
  };

  // function to fetch completed task list
  public func getCompletedtodo() : async [Text] {
    switch (usersByUsername.get(currentUser)) {
      case (?user) {
        return user.completedTodo;
      };
      case (null) {
        return [];
      };
    };
  };
};