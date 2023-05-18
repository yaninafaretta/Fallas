import React from 'react';
import {
  ChakraProvider,
  Container,
  Text,
  theme,
  Flex,
  Heading,
  Stack,
  Button,
  Progress,
  Box,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box h="100vh" w="100vw" bgGradient="linear(135deg, cornsilk 0%, lemonchiffon 100%)">
        <Container maxW="5xl">
          <Stack
            align={'center'}
            spacing={10}
            py={28}
          >
            <Heading fontSize="6xl">
              Beer{' '}
              <Text as="span" color={'orange.400'}>XP</Text>
            </Heading>
            <Text color={'gray.500'} maxW={'3xl'}>
              descripcion copada
            </Text>
            <Stack spacing={6} direction={'row'}>
              <Box
                borderWidth="2px"
                rounded="lg"
                borderColor="gray.500"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                p={8}
                m={8}
                as="form"
              >
                <Progress
                  // ir agregando aca en base a cuan lleno esta el form
                  // pasar a `isIndeterminate` cuando se esta greppeando el resultado
                  value={10}
                  hasStripe
                  colorScheme='orange'
                  mb={4}
                  mx={8}
                  isAnimated
                />
                <Flex>
                  <FormControl mr={8}>
                    <FormLabel>
                      Color
                    </FormLabel>
                    <Input />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      Cuerpo
                    </FormLabel>
                    <Input />
                  </FormControl>
                </Flex>
                <FormControl mt="2%">
                  <FormLabel>
                    Malta
                  </FormLabel>
                  <Input />
                  <FormHelperText>descripcion de algo que haga falta</FormHelperText>
                </FormControl>

                <FormControl mt={8}>
                  <Flex>
                    <FormControl mr={8}>
                      <FormLabel>
                        ABV
                      </FormLabel>
                      <Input />
                    </FormControl>

                    <FormControl>
                      <FormLabel>
                        IBU
                      </FormLabel>
                      <Input />
                    </FormControl>
                  </Flex>
                </FormControl>
                <ButtonGroup mt="5%" w="100%" flex justifyContent={"center"}>
                  <Button
                    w="7rem"
                    colorScheme="orange"
                    variant="outline"
                  >
                    Cerveza?
                  </Button>
                </ButtonGroup>
              </Box>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </ChakraProvider >
  );
}

export default App;
