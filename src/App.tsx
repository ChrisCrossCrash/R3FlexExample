import * as THREE from 'three'
import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useAspect, Html, TorusKnot, Plane, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Flex, Box, useReflow } from '@react-three/flex'

const state = {
  top: 0,
}

const CustomText = React.forwardRef<Text, React.ComponentProps<typeof Text>>(
  (props, ref) => {
    const defaultFont = `https://fonts.gstatic.com/s/raleway/v17/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvao7CIPrcVIT9d0c8.woff`
    const reflow = useReflow()

    return (
      <Text
        ref={ref}
        anchorX={props.anchorX || 'left'}
        anchorY={props.anchorY || 'top'}
        textAlign={props.textAlign || 'left'}
        font={props.font || defaultFont}
        // Trigger a reflow after the font loads
        onSync={reflow}
        {...props}
      >
        {props.children}
      </Text>
    )
  }
)

const Title = () => {
  return (
    <Box
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      width='100%'
      height='100%'
    >
      <Box margin={0.05}>
        <CustomText fontSize={0.5} letterSpacing={0.1} textAlign='center'>
          REACT
        </CustomText>
      </Box>
      <Box margin={0.05}>
        <CustomText fontSize={0.5} letterSpacing={0.1} textAlign='center'>
          THREE
        </CustomText>
      </Box>
      <Box margin={0.05}>
        <CustomText fontSize={0.5} letterSpacing={0.1} textAlign='center'>
          FIBER
        </CustomText>
      </Box>
    </Box>
  )
}

const BackGrid = () => {
  const { scene } = useThree()
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0, 0.05)
  }, [scene])

  return (
    <Plane
      position={[0, -1, -8]}
      rotation={[Math.PI / 2, 0, 0]}
      args={[80, 80, 128, 128]}
    >
      <meshStandardMaterial color='#ea5455' wireframe side={THREE.DoubleSide} />
    </Plane>
  )
}

const RotatingObj = () => {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(
    ({ clock }) =>
      (ref.current.rotation.x = ref.current.rotation.y = clock.getElapsedTime())
  )
  return (
    <TorusKnot
      ref={ref}
      position={[0, 0, 0]}
      scale={[0.3, 0.3, 0.3]}
      args={[1, 0.4, 128, 32]}
    >
      <meshStandardMaterial />
    </TorusKnot>
  )
}

const Page = ({ onChangePages }: any) => {
  const group = useRef<THREE.Group>(null!)
  const { size } = useThree()
  const [vpWidth, vpHeight] = useAspect(size.width, size.height)
  const vec = new THREE.Vector3()
  useFrame(() =>
    group.current.position.lerp(vec.set(0, state.top / 100, 0), 0.1)
  )
  const handleReflow = useCallback(
    (w: number, h: number) => {
      onChangePages(h / vpHeight)
      // console.log({ h, vpHeight, pages: h / vpHeight });
    },
    [onChangePages, vpHeight]
  )

  return (
    <group ref={group}>
      <BackGrid />

      <Flex
        flexDirection='column'
        size={[vpWidth, vpHeight, 0]}
        onReflow={handleReflow}
        position={[-vpWidth / 2, vpHeight / 2, 0]}
      >
        <Title />

        <group position-z={-0.3}>
          <Box
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
            flexWrap='wrap'
            width='100%'
            marginTop={0.3}
            marginBottom={0.1}
          >
            <Box centerAnchor>
              <RotatingObj />
            </Box>
            <Box marginLeft={0.3}>
              <CustomText fontSize={0.4} maxWidth={1} textAlign='center'>
                Flexing some Layout
              </CustomText>
            </Box>
          </Box>
          <Box
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
            flexWrap='wrap'
            width='100%'
            marginTop={0.1}
            marginBottom={0.5}
          >
            <Box marginLeft={0.3}>
              <CustomText fontSize={0.4} maxWidth={vpWidth} textAlign='center'>
                with REACT THREE FLEX
              </CustomText>
            </Box>
          </Box>
        </group>

        <Box
          flexDirection='row'
          alignItems='center'
          justifyContent='center'
          flexWrap='wrap'
          width='100%'
        >
          <Box margin={0.05}>
            <mesh position={[2.5 / 2, -1, 0]}>
              <planeBufferGeometry args={[2.5, 2]} />
              <meshStandardMaterial
                color={['#2d4059', '#ea5455', '#decdc3', '#e5e5e5'][0 % 4]}
              />
            </mesh>
            <Box flexDirection='column' padding={0.1}>
              <Box marginBottom={0.1} marginLeft={0.05}>
                <CustomText
                  fontSize={0.2}
                  letterSpacing={0.1}
                  textAlign='center'
                >
                  OUR PRODUCTS
                </CustomText>
              </Box>
              <Box flexDirection='row' flexWrap='wrap' width={2} flexGrow={1}>
                {new Array(8).fill(0).map((k, i) => (
                  <Box margin={0.05} key={i}>
                    <mesh position={[0.3 / 2, -0.3 / 2, 0]}>
                      <planeBufferGeometry args={[0.3, 0.3]} />
                      <meshStandardMaterial />
                    </mesh>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box margin={0.05}>
            <mesh position={[2.5 / 2, -1, 0]}>
              <planeBufferGeometry args={[2.5, 2]} />
              <meshStandardMaterial
                color={['#2d4059', '#ea5455', '#decdc3', '#e5e5e5'][1 % 4]}
              />
            </mesh>
            <Box flexDirection='column' padding={0.1}>
              <Box marginBottom={0.1} marginLeft={0.05}>
                <CustomText
                  fontSize={0.2}
                  letterSpacing={0.1}
                  textAlign='center'
                >
                  OUR SERVICES
                </CustomText>
              </Box>
              <Box flexDirection='row' flexWrap='wrap' width={2} flexGrow={1}>
                {new Array(8).fill(0).map((k, i) => (
                  <Box margin={0.05} key={i}>
                    <mesh position={[0.3 / 2, -0.3 / 2, 0]}>
                      <planeBufferGeometry args={[0.3, 0.3]} />
                      <meshStandardMaterial />
                    </mesh>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <group position-z={0.4}>
          <Box
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            width='100%'
            marginTop={0.8}
            marginBottom={1}
          >
            <Box margin={0.1}>
              <CustomText
                fontSize={0.2}
                letterSpacing={0.1}
                maxWidth={vpWidth * 0.8}
                textAlign='center'
              >
                ORDER WITH CONFIDENCE
              </CustomText>
            </Box>
            <Box margin={0.1}>
              <CustomText
                fontSize={0.2}
                letterSpacing={0.1}
                maxWidth={vpWidth * 0.8}
                textAlign='center'
              >
                ONE DAY DELIVERY
              </CustomText>
            </Box>
          </Box>
        </group>

        <Box
          flexDirection='row'
          alignItems='center'
          justifyContent='center'
          flexWrap='wrap'
          width='100%'
          // width="70%"
        >
          {new Array(8 * 4).fill(0).map((k, i) => (
            <Box margin={0.05} key={i}>
              <mesh position={[0.5, -0.5, 0]}>
                <planeBufferGeometry args={[1, 1]} />
                <meshStandardMaterial
                  color={['#2d4059', '#ea5455', '#decdc3', '#e5e5e5'][i % 4]}
                />
              </mesh>
            </Box>
          ))}
        </Box>
      </Flex>
    </group>
  )
}

const App = () => {
  const scrollArea = useRef(null!)
  // useEffect(() => void onScroll({ target: scrollArea.current }), [])
  const [pages, setPages] = useState(0)
  return (
    <>
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: [0, 0, 2], zoom: 1 }}
        // orthographic
        // pixelRatio={window.devicePixelRatio}
      >
        <pointLight position={[0, 1, 4]} intensity={0.1} />
        <ambientLight intensity={0.2} />
        <spotLight
          position={[1, 1, 1]}
          penumbra={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={<Html center>loading..</Html>}>
          <Page onChangePages={setPages} />
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={1024}
          />
        </EffectComposer>
      </Canvas>
      <div
        className='scrollArea'
        ref={scrollArea}
        onScroll={(e: any) => (state.top = e.target.scrollTop)}
      >
        <div style={{ height: `${pages * 100}vh` }} />
      </div>
    </>
  )
}

export default App
