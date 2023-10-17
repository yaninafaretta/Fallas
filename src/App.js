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
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
    HStack,
    Tag,
    TagLabel,
    Button,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    Image,
} from "@chakra-ui/react";
import rules from "./Engine/rules.json";
import ForwardChainingEngine from "./Engine/ForwardChainingEngine"
import { InfoIcon } from "@chakra-ui/icons";

import "./styles.css";
import { useHotkeys } from "react-hotkeys-hook";

const engine = new ForwardChainingEngine(rules);

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

function App() {
    const [beer, setBeer] = React.useState(null);

    const [color, setColor] = React.useState(null);
    const [cuerpo, setCuerpo] = React.useState(null);
    const [malta, setMalta] = React.useState(null);
    const [IBU, setIBU] = React.useState(null);
    const [ABV, setABV] = React.useState(null);
    const [maridaje, setMaridaje] = React.useState(["Sola"]);

    const [errors, setErrors] = React.useState({
        color: "",
        cuerpo: "",
        malta: "",
    });

    const [showLoader, setShowLoader] = React.useState(false);
    const [showBeerRecomendation, setShowBeerRecomendation] =
        React.useState(false);

    const toggleMaridaje = (m) => {
        if (maridaje.includes(m)) {
            setMaridaje(maridaje.filter((x) => x !== m));
        } else {
            setMaridaje([...maridaje, m]);
        }
    };

    // Secret: tocar algun numero pre-carga una cerveza
    useHotkeys('0,1,2,3,4,5,6,7', (e) => {
        const n = parseInt(e.key)
        const beer = rules[n];
        const facts = beer.conditions
        const getfact = (fact) => facts.find((c) => c.key === fact)?.value
        setColor(getfact('color'))
        setCuerpo(getfact('cuerpo'))
        setMalta(getfact('malta'))
        setIBU(getfact('IBU'))
        setABV(getfact('ABV'))

        const maridajes = facts[facts.length - 1].any
        setMaridaje(maridajes.map((c) => c.value))
    })

    const checkValidations = (next) => {
        setErrors((previousErrors) => ({
            color: "",
            cuerpo: "",
            malta: "",
        }));
        if (!color) {
            setErrors((previousErrors) => ({
                ...previousErrors,
                color: "Debe seleccionar un color",
            }));
        }
        if (!cuerpo) {
            setErrors((previousErrors) => ({
                ...previousErrors,
                cuerpo: "Debe seleccionar un cuerpo",
            }));
        }
        if (!malta) {
            setErrors((previousErrors) => ({
                ...previousErrors,
                malta: "Debe seleccionar una malta",
            }));
        }
        if (color && cuerpo && malta) {
            next();
        }
    };

    const obtainBeerRecomendation = async () => {
        setShowLoader(true);
        const facts = {
            color: color,
            cuerpo: cuerpo,
            malta: malta,
            IBU: IBU,
            ABV: ABV,
            maridaje: maridaje,
        };

        const results = engine.run(facts);
        setBeer(results.length && {
            type: results[0].recommendation,
            conditionsMatched: results[0].conditionsMatched,
        });
        setShowBeerRecomendation(true);
        setShowLoader(false);
    };

    return (
        <ChakraProvider>
            <Flex
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
                    <Heading fontSize="2xl">
                        ¿Salis a comer y no saber que cerveza tomar? ¡Nosotros
                        te ayudamos! 🍻
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
                                        borderColor={
                                            errors.color ? "red" : "gray.500"
                                        }
                                        value={color ?? undefined}
                                        defaultValue=""
                                    >
                                        <option
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
                                    {errors.color && (
                                        <Text className="field-error">
                                            {errors.color}
                                        </Text>
                                    )}
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
                                        borderColor={
                                            errors.cuerpo ? "red" : "gray.500"
                                        }
                                        value={cuerpo ?? undefined}
                                        defaultValue=""
                                    >
                                        <option
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
                                    {errors.cuerpo && (
                                        <Text className="field-error">
                                            {errors.cuerpo}
                                        </Text>
                                    )}
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
                                    borderColor={
                                        errors.malta ? "red" : "gray.500"
                                    }
                                    value={malta ?? undefined}
                                    defaultValue=""
                                >
                                    <option
                                        hidden
                                        disabled
                                        value=""
                                    >
                                        Seleccione un tipo de malta
                                    </option>
                                    {maltas.map((malta) => (
                                        <option key={malta} value={malta}>
                                            {malta}
                                        </option>
                                    ))}
                                </Select>
                                {errors.malta && (
                                    <Text className="field-error">
                                        {errors.malta}
                                    </Text>
                                )}
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
                                            value={ABV ?? 3}
                                        >
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <Tooltip
                                                hasArrow
                                                bg="orange.400"
                                                placement="bottom"
                                                isOpen={!showBeerRecomendation}
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
                                            value={IBU ?? 3}
                                        >
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <Tooltip
                                                hasArrow
                                                bg="orange.400"
                                                placement="bottom"
                                                isOpen={!showBeerRecomendation}
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
                                                <TagLabel>{m}</TagLabel>
                                            </Tag>
                                        ))}
                                    </HStack>
                                </FormControl>
                                <FormControl className="button-container">
                                    <Button
                                        colorScheme="orange"
                                        size="lg"
                                        onClick={() =>
                                            checkValidations(
                                                obtainBeerRecomendation
                                            )
                                        }
                                    >
                                        {showLoader ? (
                                            <Spinner color="white" />
                                        ) : (
                                            <>Buscar Cerveza</>
                                        )}
                                    </Button>
                                </FormControl>
                            </FormControl>
                        </Box>
                    </Stack>
                    <Modal
                        isOpen={showBeerRecomendation}
                        onClose={() => setShowBeerRecomendation(false)}
                    >
                        <ModalOverlay />
                        <ModalContent bgGradient="linear(135deg, cornsilk 0%, lemonchiffon 100%)">
                            <ModalCloseButton />
                            <ModalBody>
                                <div className="image-container">
                                    <Image
                                        className="image"
                                        src={
                                            beer?.type
                                                ? "https://www.pngmart.com/files/15/Happy-Face-Clipart-PNG.png"
                                                : "https://cdn-icons-png.flaticon.com/512/5372/5372351.png"
                                        }
                                        alt="Dan Abramov"
                                        boxSize="100px"
                                    />
                                </div>
                                {beer?.type ? (
                                    <Heading
                                        fontSize="3xl"
                                        className="modal-text"
                                    >
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
                                    <Heading
                                        fontSize="3xl"
                                        className="modal-text"
                                    >
                                        No tenemos una cerveza para recomendarte
                                    </Heading>
                                )}
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Stack>
            </Flex>
        </ChakraProvider>
    );
}

export default App;
