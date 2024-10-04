import { Test, TestingModule } from '@nestjs/testing';
import { RssiController } from './rssi.controller';

describe('RssiController', () => {
  let controller: RssiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RssiController],
    }).compile();

    controller = module.get<RssiController>(RssiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
