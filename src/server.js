import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import axios from "axios";

const userData = {
  name: "Kshirodra",
  age: 32,
  address: "Bengaluru"
};

const getEmployee = async () =>
  await axios
    .get("https://api.myjson.com/bins/o6uok")
    .then(response => response.data);

const typeDefs = gql`
  type Query {
    user: userResponseDef
    employee: employeeDef
  }

  type userResponseDef {
    name: String
    age: Int
    address: String
  }

  type employeeDef {
    id: String
    employee_name: String
    employee_salary: String
    employee_age: String
    profile_image: String
    user: userResponseDef
  }
`;

const employeeDetails = async () => {
  const employee = await getEmployee();

  return {
    ...employee,
    user: userData
  };
};
const resolvers = {
  Query: {
    user: () => userData,
    employee: async () => await employeeDetails()
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 3001 }, () =>
  console.log("Now browse to http://localhost:3001" + server.graphqlPath)
);
