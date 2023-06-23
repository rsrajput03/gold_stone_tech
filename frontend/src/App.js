import axios from "axios";

import "./App.css";
import { useEffect, useState } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Table,
  Box,
  Button,
  Heading,
  useDisclosure,
  FormLabel,
  Input,
  Flex,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function App() {
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    status: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getUsers = () => {
    axios
      .get("https://kind-jade-starfish-wig.cyclic.app/")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.get(
        `https://kind-jade-starfish-wig.cyclic.app/${id}`
      );
      console.log(res.data);
      setFormData(res.data);
    } catch (error) {
      console.log(error);
    }
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = formData._id;
    console.log(id);
    const res = await axios.put(
      `https://kind-jade-starfish-wig.cyclic.app/${id}`,
      formData
    );
    console.log(res);
    setFormData({
      name: "",
      email: "",
      gender: "",
      status: "",
    });
    onClose();
  };

  useEffect(() => {
    getUsers();
  }, [handleSubmit]);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/update"
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "User_Master_Data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box className="App">
        <Flex justifyContent={"center"} gap={"50%"}>
          <Heading as={"h1"}>Users Data</Heading>
          <Button onClick={handleDownload} colorScheme="blue">
            Download CSV file
          </Button>
        </Flex>

        <Box w={"100%"} mt={"45px"}>
          <TableContainer>
            <Table variant={"striped"}>
              <TableCaption textColor={"black"} fontWeight={"bold"}>
                Users Data
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>id</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Gender</Th>
                  <Th>Status</Th>
                  <Th>Update</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data &&
                  data.map((el) => {
                    return (
                      <Tr key={el.id}>
                        <Td>{el.id}</Td>
                        <Td>{el.name}</Td>
                        <Td>{el.email}</Td>
                        <Td>{el.gender}</Td>
                        <Td>{el.status}</Td>
                        <Td>
                          <Button
                            colorScheme="pink"
                            onClick={() => handleUpdate(el._id)}
                          >
                            Edit
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <>
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update your Data</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleSubmit}>
                <FormLabel>Email </FormLabel>
                <Input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                />
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                />
                <FormLabel>Gender</FormLabel>
                <Input
                  type="text"
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                />
                <FormLabel>Status</FormLabel>
                <Input
                  type="text"
                  name="status"
                  onChange={handleChange}
                  value={formData.status}
                />
                <ModalFooter>
                  <Button type="submit" colorScheme="blue" mr={3}>
                    Sumbit
                  </Button>
                </ModalFooter>
              </form>
              <Button onClick={onClose}>Cancel</Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    </>
  );
}

export default App;
