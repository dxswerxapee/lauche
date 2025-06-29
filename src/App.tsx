import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  Play, 
  Settings, 
  Info, 
  Monitor, 
  Cpu, 
  HardDrive,
  Minimize2,
  Maximize2,
  X,
  Zap,
  Code,
  Terminal,
  Wrench
} from 'lucide-react';

// Styled Components с градиентами и анимациями
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
  position: relative;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(75, 0, 130, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const TitleBar = styled.div`
  height: 32px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  -webkit-app-region: drag;
  border-bottom: 1px solid rgba(138, 43, 226, 0.2);
`;

const TitleText = styled.h1`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(90deg, #ffffff, #b19cd9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
`;

const WindowButton = styled(motion.button)`
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(138, 43, 226, 0.3);
  }

  &.close:hover {
    background: rgba(255, 69, 58, 0.8);
  }
`;

const MainContent = styled.div`
  height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled(motion.header)`
  padding: 40px;
  text-align: center;
  position: relative;
`;

const Logo = styled(motion.div)`
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff, #b19cd9, #8a2be2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 30px rgba(138, 43, 226, 0.5);
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 0 40px 40px;
`;

const Sidebar = styled(motion.div)`
  width: 300px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(138, 43, 226, 0.3);
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #8a2be2, transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const MainPanel = styled(motion.div)`
  flex: 1;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(138, 43, 226, 0.2);
  padding: 30px;
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UtilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const UtilityCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid rgba(138, 43, 226, 0.3);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(transparent, rgba(138, 43, 226, 0.1), transparent);
    animation: rotate 4s linear infinite;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const UtilityIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #8a2be2, #4b0082);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
`;

const UtilityTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: white;
  position: relative;
  z-index: 1;
`;

const UtilityDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  position: relative;
  z-index: 1;
`;

const SystemInfo = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid rgba(138, 43, 226, 0.2);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.95rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
`;

const InfoValue = styled.span`
  color: #b19cd9;
  font-weight: 600;
`;

// Компонент приложения
const App: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('utilities');

  useEffect(() => {
    // Загружаем системную информацию
    if (window.electronAPI) {
      window.electronAPI.getSystemInfo().then(setSystemInfo);
    }
  }, []);

  const utilities = [
    {
      icon: <Code size={24} />,
      title: "Инструменты разработчика",
      description: "Полезные утилиты для программирования",
      category: "dev"
    },
    {
      icon: <Terminal size={24} />,
      title: "Системные скрипты",
      description: "Автоматизация системных задач",
      category: "system"
    },
    {
      icon: <Wrench size={24} />,
      title: "Утилиты обслуживания",
      description: "Инструменты для оптимизации системы",
      category: "maintenance"
    },
    {
      icon: <Monitor size={24} />,
      title: "Мониторинг системы",
      description: "Отслеживание производительности",
      category: "monitoring"
    }
  ];

  const handleWindowControl = (action: string) => {
    if (window.electronAPI) {
      switch (action) {
        case 'minimize':
          window.electronAPI.minimizeWindow();
          break;
        case 'maximize':
          window.electronAPI.maximizeWindow();
          break;
        case 'close':
          window.electronAPI.closeWindow();
          break;
      }
    }
  };

  return (
    <AppContainer>
      <TitleBar>
        <TitleText>DRXQVLN LAUNCHER</TitleText>
        <WindowControls>
          <WindowButton 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleWindowControl('minimize')}
          >
            <Minimize2 size={14} />
          </WindowButton>
          <WindowButton 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleWindowControl('maximize')}
          >
            <Maximize2 size={14} />
          </WindowButton>
          <WindowButton 
            className="close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleWindowControl('close')}
          >
            <X size={14} />
          </WindowButton>
        </WindowControls>
      </TitleBar>

      <MainContent>
        <Header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            DRXQVLN
          </Logo>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Современный лаунчер утилит и инструментов
          </Subtitle>
        </Header>

        <ContentArea>
          <Sidebar
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SectionTitle>
              <Info size={20} />
              Системная информация
            </SectionTitle>
            
            {systemInfo && (
              <SystemInfo>
                <InfoRow>
                  <InfoLabel>Платформа:</InfoLabel>
                  <InfoValue>{systemInfo.platform}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Архитектура:</InfoLabel>
                  <InfoValue>{systemInfo.arch}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>ЦПУ ядер:</InfoLabel>
                  <InfoValue>{systemInfo.cpus}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Память:</InfoLabel>
                  <InfoValue>{Math.round(systemInfo.totalMemory / 1024 / 1024 / 1024)} ГБ</InfoValue>
                </InfoRow>
              </SystemInfo>
            )}

            <SectionTitle style={{ marginTop: '30px' }}>
              <Settings size={20} />
              Настройки
            </SectionTitle>
            
            <SystemInfo>
              <InfoRow>
                <InfoLabel>Версия лаунчера:</InfoLabel>
                <InfoValue>1.0.0</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Статус:</InfoLabel>
                <InfoValue style={{ color: '#4ade80' }}>Активен</InfoValue>
              </InfoRow>
            </SystemInfo>
          </Sidebar>

          <MainPanel
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SectionTitle>
              <Zap size={20} />
              Доступные утилиты
            </SectionTitle>

            <UtilityGrid>
              <AnimatePresence>
                {utilities.map((utility, index) => (
                  <UtilityCard
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 10px 40px rgba(138, 43, 226, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UtilityIcon>
                      {utility.icon}
                    </UtilityIcon>
                    <UtilityTitle>{utility.title}</UtilityTitle>
                    <UtilityDescription>{utility.description}</UtilityDescription>
                  </UtilityCard>
                ))}
              </AnimatePresence>
            </UtilityGrid>
          </MainPanel>
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
};

export default App; 