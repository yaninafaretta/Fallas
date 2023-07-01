import React from "react";
import {
    ChakraProvider,
    Text,
    Flex,
    Heading,
    Stack,
    Box,
    FormControl,
    FormLabel,
    Select,
    Slider,
    SliderMark,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
    HStack,
    Tag,
    TagLeftIcon,
    TagLabel,
} from "@chakra-ui/react";
import beers from "./beers.json";
import { Engine } from "json-rules-engine";
import { SmallAddIcon, SmallCloseIcon, InfoIcon } from "@chakra-ui/icons";

import "./styles.css";

const engine = new Engine(beers.decisions);

const colors = ["Clara", "Rubia", "Roja", "Negra"];
const cuerpos = ["Ligero", "Medio", "Completo", "Cremoso"];
const maltas = ["Pálida", "Caramelo", "Tostada", "Chocolate", "Negra"];
const IBUs = [
    "Sin amargor",
    "Poco amargor",
    "Amarga",
    "Amargor moderado",
    "Muy amarga",
];
const ABVs = ["Sin alcohol", "Bajo", "Moderado", "Elevado", "Muy elevado"];
const maridajes = [
    "Salado",
    "Torta",
    "Carnes rojas",
    "Carnes blancas",
    "Quesos",
    "Sola",
];

const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
};

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
                    results.forEach((r) => {
                        r.conditionsMatched = r.conditions.any.reduce(
                            (acc, c) => acc + (c.result ? 1 : 0),
                            0
                        );
                    });
                    results = results.filter((r) => r.conditionsMatched >= 3);
                    results.sort(
                        (a, b) => b.conditionsMatched - a.conditionsMatched
                    );

                    return {
                        type: results[0]?.event.type,
                        conditionsMatched: results[0]?.conditionsMatched,
                    };
                })
            );
        };
        b();
    }, [ABV, IBU, color, cuerpo, malta, maridaje]);

    return (
        <ChakraProvider>
            <Flex
                h="100vh"
                w="100vw"
                bgGradient="linear(135deg, cornsilk 0%, lemonchiffon 100%)"
                justifyContent={"center"}
                pb={4}
                px={8}
                overflow="hidden"
            >
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
                                    <FormLabel>
                                        <Tooltip
                                            hasArrow
                                            label="Color de la cerveza"
                                            fontSize="sm"
                                        >
                                            <div
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                Color
                                                <InfoIcon
                                                    ml={1}
                                                    color="orange.400"
                                                />
                                            </div>
                                        </Tooltip>
                                    </FormLabel>
                                    <Select
                                        onChange={(e) =>
                                            setColor(e.target.value)
                                        }
                                        borderColor="gray.500"
                                    >
                                        <option
                                            selected
                                            hidden
                                            disabled
                                            value=""
                                        >
                                            Seleccione un color
                                        </option>
                                        {colors.map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>
                                        <Tooltip
                                            hasArrow
                                            label="Sensación en la boca al tomarla"
                                            fontSize="sm"
                                        >
                                            <div
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                Cuerpo
                                                <InfoIcon
                                                    ml={1}
                                                    color="orange.400"
                                                />
                                            </div>
                                        </Tooltip>
                                    </FormLabel>
                                    <Select
                                        onChange={(e) =>
                                            setCuerpo(e.target.value)
                                        }
                                        borderColor="gray.500"
                                    >
                                        <option
                                            selected
                                            hidden
                                            disabled
                                            value=""
                                        >
                                            Seleccione un cuerpo
                                        </option>
                                        {cuerpos.map((cuerpo) => (
                                            <option key={cuerpo} value={cuerpo}>
                                                {cuerpo}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Flex>

                            <FormControl mt="2%">
                                <FormLabel>
                                    <Tooltip
                                        hasArrow
                                        label="Tipo de tostado de la malta"
                                        fontSize="sm"
                                    >
                                        <div
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Malta
                                            <InfoIcon
                                                ml={1}
                                                color="orange.400"
                                            />
                                        </div>
                                    </Tooltip>
                                </FormLabel>
                                <Select
                                    onChange={(e) => setMalta(e.target.value)}
                                    borderColor="gray.500"
                                >
                                    <option selected hidden disabled value="">
                                        Seleccione un tipo de malta
                                    </option>
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
                                        <FormLabel>
                                            <Tooltip
                                                hasArrow
                                                label="Cantidad de alcohol"
                                                fontSize="sm"
                                            >
                                                <div
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    ABV
                                                    <InfoIcon
                                                        ml={1}
                                                        color="orange.400"
                                                    />
                                                </div>
                                            </Tooltip>
                                        </FormLabel>
                                        <Slider
                                            min={1}
                                            max={ABVs.length}
                                            step={1}
                                            onChange={setABV}
                                            colorScheme="orange"
                                            defaultValue={3}
                                        >
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <Tooltip
                                                hasArrow
                                                bg="orange.400"
                                                placement="bottom"
                                                isOpen
                                                label={
                                                    ABV
                                                        ? ABVs[ABV - 1]
                                                        : ABVs[2]
                                                }
                                            >
                                                <SliderThumb />
                                            </Tooltip>
                                        </Slider>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>
                                            <Tooltip
                                                hasArrow
                                                label="Nivel de amargor"
                                                fontSize="sm"
                                            >
                                                <div
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    IBU
                                                    <InfoIcon
                                                        ml={1}
                                                        color="orange.400"
                                                    />
                                                </div>
                                            </Tooltip>
                                        </FormLabel>
                                        <Slider
                                            min={1}
                                            max={IBUs.length}
                                            step={1}
                                            onChange={setIBU}
                                            colorScheme="orange"
                                            defaultValue={3}
                                        >
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <Tooltip
                                                hasArrow
                                                bg="orange.400"
                                                placement="bottom"
                                                isOpen
                                                label={
                                                    IBU
                                                        ? IBUs[IBU - 1]
                                                        : IBUs[2]
                                                }
                                            >
                                                <SliderThumb />
                                            </Tooltip>
                                        </Slider>
                                    </FormControl>
                                </Flex>

                                <FormControl mt="4%">
                                    <FormLabel>
                                        <Tooltip
                                            hasArrow
                                            label="Acompañamiento de la cerveza"
                                            fontSize="sm"
                                        >
                                            <div
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                Maridajes
                                                <InfoIcon
                                                    ml={1}
                                                    color="orange.400"
                                                />
                                            </div>
                                        </Tooltip>
                                    </FormLabel>
                                    <HStack spacing={2} flexWrap={"wrap"}>
                                        {maridajes.map((m) => (
                                            <Tag
                                                key={m}
                                                size="lg"
                                                variant={
                                                    maridaje.includes(m)
                                                        ? "solid"
                                                        : "outline"
                                                }
                                                colorScheme="orange"
                                                onClick={() => {
                                                    toggleMaridaje(m);
                                                }}
                                                my={1}
                                                p={2}
                                                cursor="pointer"
                                                className="tag"
                                            >
                                                <TagLeftIcon
                                                    as={
                                                        maridaje.includes(m)
                                                            ? SmallCloseIcon
                                                            : SmallAddIcon
                                                    }
                                                />
                                                <TagLabel>{m}</TagLabel>
                                            </Tag>
                                        ))}
                                    </HStack>
                                </FormControl>
                            </FormControl>
                        </Box>
                    </Stack>
                    {beer?.type ? (
                        <Heading fontSize="4xl">
                            {(beer.conditionsMatched < 4 &&
                                "Tal vez te gusta la cerveza... ") ||
                                (beer.conditionsMatched === 4 &&
                                    "Una buena opción es la cerveza... ") ||
                                (beer.conditionsMatched === 5 &&
                                    "Una muy buena opción es la cerveza... ") ||
                                (beer.conditionsMatched === 6 &&
                                    "Tu cerveza perfecta es la... ")}
                            <Text as="span" color={"orange.500"}>
                                {beer.type}
                            </Text>
                        </Heading>
                    ) : (
                        <Heading fontSize="4xl">
                            No tenemos una cerveza para recomendarte
                        </Heading>
                    )}
                </Stack>
            </Flex>
        </ChakraProvider>
    );
}

export default App;
