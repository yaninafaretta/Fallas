import React from "react";
import {
  ChakraProvider,
  Container,
  Text,
  Flex,
  Heading,
  Stack,
  Box,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Checkbox,
} from "@chakra-ui/react";
import beers from "./beers.json";
import { Engine } from "json-rules-engine";

const engine = new Engine(beers.decisions);

const colors = ["clara", "rubia", "roja", "negra"];
const cuerpos = ["ligero", "medio", "completo", "cremoso"];
const maltas = ["pálida", "caramelo", "tostada", "chocolate", "negra"];
const IBUs = [
  "sin amargor",
  "poco amargor",
  "amarga",
  "amargor moderado",
  "muy amarga",
];
const ABVs = ["sin alcohol", "bajo", "moderado", "elevado", "muy elevado"];
const maridajes = [
  "salado",
  "torta",
  "carnes rojas",
  "carnes blancas",
  "quesos",
  "sola",
];

function App() {
  const [beer, setBeer] = React.useState(null);

  const [color, setColor] = React.useState(null);
  const [cuerpo, setCuerpo] = React.useState(null);
  const [malta, setMalta] = React.useState(null);
  const [IBU, setIBU] = React.useState(null);
  const [ABV, setABV] = React.useState(null);
  const [maridaje, setMaridaje] = React.useState([]);

  const toggleMaridaje = (m) => {
    if (maridaje.includes(m)) {
      setMaridaje(maridaje.filter((x) => x !== m));
    } else {
      setMaridaje([...maridaje, m]);
    }
  };

  React.useEffect(() => {
    const b = async () => {
      const facts = {
        color: color,
        cuerpo: cuerpo,
        malta: malta,
        IBU: IBU,
        ABV: ABV,
        maridaje: maridaje,
      };
      setBeer(
        await engine.run(facts).then(({ results }) => {
          return results[0]?.event.type;
        })
      );
    };
    b();
  }, [ABV, IBU, color, cuerpo, malta, maridaje]);

  return (
    <ChakraProvider>
      <Box
        h="100vh"
        w="100vw"
        bgGradient="linear(135deg, cornsilk 0%, lemonchiffon 100%)"
      >
        <Container maxW="5xl">
          <Stack align={"center"} spacing={10} py={28}>
            <Heading fontSize="6xl">
              Beer{" "}
              <Text as="span" color={"orange.400"}>
                XP
              </Text>
            </Heading>
            <Stack spacing={6} direction={"row"}>
              <Box
                borderWidth="2px"
                rounded="lg"
                borderColor="gray.500"
                shadow="1px 1px 3px rgba(0,0,0,0.3)"
                p={8}
                m={8}
                as="form"
                w="70vw"
              >
                <Flex>
                  <FormControl mr={8}>
                    <FormLabel>Color</FormLabel>
                    <Select
                      placeholder="Color"
                      onChange={(e) => setColor(e.target.value)}
                    >
                      {colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cuerpo</FormLabel>
                    <Select
                      placeholder="Cuerpo"
                      onChange={(e) => setCuerpo(e.target.value)}
                    >
                      {cuerpos.map((cuerpo) => (
                        <option key={cuerpo} value={cuerpo}>
                          {cuerpo}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Flex>

                <FormControl mt="2%">
                  <FormLabel>Malta</FormLabel>
                  <Select
                    placeholder="Malta"
                    onChange={(e) => setMalta(e.target.value)}
                  >
                    {maltas.map((malta) => (
                      <option key={malta} value={malta}>
                        {malta}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl mt={8}>
                  <Flex>
                    <FormControl mr={8}>
                      <FormLabel>ABV</FormLabel>
                      <Slider
                        min={1}
                        max={ABVs.length}
                        step={1}
                        onChange={setABV}
                        colorScheme="orange"
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <Tooltip
                          hasArrow
                          bg="orange.400"
                          placement="bottom"
                          isOpen={ABV !== null}
                          label={ABVs[ABV]}
                        >
                          <SliderThumb />
                        </Tooltip>
                      </Slider>
                    </FormControl>

                    <FormControl>
                      <FormLabel>IBU</FormLabel>
                      <Slider
                        min={1}
                        max={IBUs.length}
                        step={1}
                        onChange={setIBU}
                        colorScheme="orange"
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <Tooltip
                          hasArrow
                          bg="orange.400"
                          placement="bottom"
                          isOpen={IBU !== null}
                          label={IBUs[IBU]}
                        >
                          <SliderThumb />
                        </Tooltip>
                      </Slider>
                    </FormControl>
                  </Flex>

                  <FormControl mt="4%">
                    <FormLabel>Maridajes</FormLabel>
                    <Stack spacing={5} direction="row">
                      {maridajes.map((m) => (
                        <Checkbox
                          key={m}
                          colorScheme="orange"
                          isChecked={maridaje.includes(m)}
                          onChange={() => {
                            toggleMaridaje(m);
                          }}
                        >
                          {m}
                        </Checkbox>
                      ))}
                    </Stack>
                  </FormControl>
                </FormControl>
              </Box>
            </Stack>
            {(beer && (
              <Heading fontSize="4xl">
                Tu cerveza perfecta es...{" "}
                <Text as="span" color={"orange.500"}>
                  {beer}
                </Text>
              </Heading>
            )) ||
              (!beer && (
                <Heading fontSize="4xl">
                  No tenemos una cerveza así registrada
                </Heading>
              ))}
          </Stack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
